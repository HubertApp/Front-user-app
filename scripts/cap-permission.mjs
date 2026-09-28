
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const IOS_MESSAGE =
  'Hubert utilise votre position pour afficher les arrêts et la circulation autour de vous.';

const ANDROID_ENTRIES = [
  '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
    '<uses-feature android:name="android.hardware.location.gps" android:required="false" />',
];

const IOS_KEYS = [
  'NSLocationWhenInUseUsageDescription',
  'NSLocationAlwaysAndWhenInUseUsageDescription',
];

function patchAndroid() {
  const file = resolve(ROOT, 'android/app/src/main/AndroidManifest.xml');
  if (!existsSync(file)) return 'android : projet absent (npx cap add android), ignoré';

  let xml = readFileSync(file, 'utf8');
  const missing = ANDROID_ENTRIES.filter(entry => {
    const name = entry.match(/android:name="([^"]+)"/)[1];
    return !xml.includes(`android:name="${name}"`);
  });
  if (!missing.length) return 'android : permissions déjà présentes';

  const block = `    <!-- Géolocalisation (scripts/cap-permissions.mjs) -->\n${missing.map(e => `    ${e}`).join('\n')}\n`;
  xml = xml.replace(/(\s*)<\/manifest>\s*$/, `\n${block}</manifest>\n`);
  writeFileSync(file, xml);
  return `android : ${missing.length} entrée(s) ajoutée(s)`;
}

function patchIos() {
  const file = resolve(ROOT, 'ios/App/App/Info.plist');
  if (!existsSync(file)) return 'ios : projet absent (npx cap add ios), ignoré';

  let plist = readFileSync(file, 'utf8');
  const missing = IOS_KEYS.filter(key => !plist.includes(`<key>${key}</key>`));
  if (!missing.length) return 'ios : descriptions déjà présentes';

  const block = missing
    .map(key => `\t<key>${key}</key>\n\t<string>${IOS_MESSAGE}</string>\n`)
    .join('');

    const index = plist.lastIndexOf('</dict>');
  plist = `${plist.slice(0, index)}${block}${plist.slice(index)}`;
  writeFileSync(file, plist);
  return `ios : ${missing.length} description(s) ajoutée(s)`;
}

for (const line of [patchAndroid(), patchIos()]) console.log(`[cap-permissions] ${line}`);
