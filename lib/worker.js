"use strict";

import { imageDimensionsFromData } from "image-dimensions";
importScripts("/uncompress.js");

// Set of valid image extensions
const validImageExtensions = new Set([
  ".jpeg",
  ".jpg",
  ".png",
  ".bmp",
  ".webp",
  ".gif",
]);

// Map of file extensions to MIME types
const mimeTypeMap = new Map([
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".png", "image/png"],
  [".bmp", "image/bmp"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
]);

/**
 * Check if a file name is a valid image type.
 * @param {string} file_name - The file name to check.
 * @returns {boolean} True if the file name is a valid image type.
 */
function isValidImageType(file_name) {
  const extension = file_name.slice(file_name.lastIndexOf(".")).toLowerCase();
  return validImageExtensions.has(extension);
}

/**
 * Get the MIME type of a file name.
 * @param {string} file_name - The file name to get the MIME type of.
 * @returns {string} The MIME type of the file name.
 * @default "image/jpeg"
 */
function getFileMimeType(file_name) {
  const extension = file_name.slice(file_name.lastIndexOf(".")).toLowerCase();
  return mimeTypeMap.get(extension) || "image/jpeg";
}

/**
 * Uncompress an archive.
 * @param {Archive} archive - The archive to uncompress.
 * @returns {void}
 */
function onUncompress(archive) {
  const entries = archive.entries.filter((entry) =>
    isValidImageType(entry.name)
  );

  const n = entries.length;

  if (n === 0) {
    self.postMessage({
      action: "error",
      error: "No Images Found",
    });
    return;
  }

  entries.map((entry, index) => {
    entry.readData(function (data, e) {
      if (e) {
        console.log(e);
        self.postMessage({
          action: "error",
          error: "Error Reading Entry",
        });
        return;
      }

      if (entry.is_file && data) {
        const dimensions = imageDimensionsFromData(data);
        const url = URL.createObjectURL(
          new Blob([data], { type: getFileMimeType(entry.name) })
        );

        self.postMessage({
          action: "uncompress",
          url: url,
          index: index + 1,
          width: dimensions?.width || 0,
          height: dimensions?.height || 0,
          total: n,
          // entry_name: entry.name,
          // size: data.byteLength,
        });
      }
    });
  });
}

self.addEventListener(
  "message",
  function (e) {
    switch (e.data.action) {
      case "start":
        try {
          const archive = archiveOpenArrayBuffer(
            e.data.file_name,
            "", // Password
            e.data.array_buffer
          );
          delete e.data;
          onUncompress(archive);
        } catch (e) {
          console.log(e);
          self.postMessage({
            action: "error",
            error: "Error Opening Archive",
          });
        }
        break;
    }
  },
  false
);

// Load all the archive formats, then signal that we are ready to use
loadArchiveFormats(["rar", "zip", "tar"], function () {
  self.postMessage({ action: "ready" });
});
