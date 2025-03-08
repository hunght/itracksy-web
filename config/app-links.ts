// Configuration file for application download links and version information

export const appVersion = '1.0.138';

export const appLinks = {
  // Main platform download links
  windows: `https://github.com/itracksy/itracksy/releases/download/v${appVersion}/itracksy-${appVersion}.Setup.exe`,
  macos: `https://github.com/itracksy/itracksy/releases/download/v${appVersion}/itracksy-${appVersion}-arm64.dmg`,
  linux: `https://github.com/itracksy/itracksy/releases/download/v${appVersion}/itracksy_${appVersion}_amd64.deb`,

  // Additional links
  releases: `https://github.com/itracksy/itracksy/releases/tag/v${appVersion}`,

  // You can add other platform-specific links if needed
  macosIntel: `https://github.com/itracksy/itracksy/releases/download/v${appVersion}/itracksy-${appVersion}.dmg`,
  linuxRpm: `https://github.com/itracksy/itracksy/releases/download/v${appVersion}/itracksy-${appVersion}.x86_64.rpm`,
};
