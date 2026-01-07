import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Linking from "expo-linking";

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "application/pdf": ["pdf"],
};

const getExt = (nameOrUri: string) => {
  const m = nameOrUri.split("?")[0].split("#")[0].split(".");
  return (m.length > 1 ? m.pop() : "")?.toLowerCase() || "";
};

const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "_");

export function useUpload() {
  const [attachedDocument, setAttachedDocument] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const [tooLarge, setTooLarge] = useState(false);

  const generateUniqueFileName = (
    prefix: string,
    originalName: string,
    mime?: string
  ) => {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const extFromName = getExt(originalName);
    const allowedExts = mime && ALLOWED[mime] ? ALLOWED[mime] : [];
    const ext = allowedExts.includes(extFromName)
      ? extFromName
      : allowedExts[0] || "bin";
    return `${prefix}_${rand}.${ext}`;
  };

  const convertToFileUri = async (contentUri: string) => {
    const baseDir =
      FileSystem.cacheDirectory || FileSystem.documentDirectory || "";
    if (!baseDir) return null;

    const target = `${baseDir}ATT_${Date.now()}.bin`;
    try {
      await FileSystem.copyAsync({ from: contentUri, to: target });
      return target;
    } catch {
      return null;
    }
  };

  const validateAndSet = async (
    uri: string,
    nameHint: string,
    mime: string
  ) => {
    if (!ALLOWED[mime]) return;

    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) return;

    if (typeof info.size === "number" && info.size > MAX_BYTES) {
      setTooLarge(true);
      return;
    }

    setAttachedDocument({
      uri,
      name: generateUniqueFileName("ATT", sanitize(nameHint), mime),
      type: mime,
    });
  };

  const ensurePermission = async (
    requestFn: () => Promise<ImagePicker.PermissionResponse>
  ) => {
    const { status, canAskAgain } = await requestFn();
    if (status === "granted") return true;
    if (!canAskAgain) await Linking.openSettings();
    return false;
  };

  const pickFromGallery = async () => {
    if (
      !(await ensurePermission(ImagePicker.requestMediaLibraryPermissionsAsync))
    )
      return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length) {
      const a = result.assets[0];
      const uri = await convertToFileUri(a.uri);
      if (uri) {
        await validateAndSet(uri, a.fileName || a.uri, "image/jpeg");
      }
    }
  };

  const pickFromCamera = async () => {
    if (!(await ensurePermission(ImagePicker.requestCameraPermissionsAsync)))
      return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length) {
      const a = result.assets[0];
      const uri = await convertToFileUri(a.uri);
      if (uri) {
        await validateAndSet(uri, a.fileName || a.uri, "image/jpeg");
      }
    }
  };

  const pickFromFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets.length) return;

    const f = result.assets[0];
    const uri = await convertToFileUri(f.uri);
    if (uri) {
      await validateAndSet(
        uri,
        f.name || f.uri,
        f.mimeType || "application/octet-stream"
      );
    }
  };

  return {
    attachedDocument,
    setAttachedDocument,
    tooLarge,
    setTooLarge,
    pickFromGallery,
    pickFromCamera,
    pickFromFiles,
  };
}
