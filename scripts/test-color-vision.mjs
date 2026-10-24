import test from 'node:test';
import assert from 'node:assert/strict';
import { colorVisionProfiles, getColorVisionProfile } from '../src/data/colorVisionProfiles.js';

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

test('Normal / Default removes palette overrides so original sample colors return', () => {
  const profile = getColorVisionProfile('default');
  assert.equal(profile.label, 'Normal / Default');
  assert.deepEqual(profile.style, {});
});

test('unknown or missing saved values safely use Normal / Default', () => {
  for (const value of [undefined, null, '', 'unknown', 'constructor', '__proto__']) {
    assert.equal(getColorVisionProfile(value), colorVisionProfiles[0]);
  }
});

const supported = colorVisionProfiles.filter(profile => profile.value !== 'default');
test('four independently selectable support presets have distinct palettes', () => {
  assert.deepEqual(supported.map(profile => profile.value), ['protanopia', 'deuteranopia', 'tritanopia', 'monochrome']);
  assert.equal(new Set(supported.map(profile => JSON.stringify(profile.style))).size, 4);
});

for (const profile of supported) {
  const palette = name => profile.style[`--vision-${name}`];
  test(`${profile.label}: text and controls meet 4.5:1 across normal, selected and highlighted surfaces`, () => {
    assert.equal(Object.keys(profile.style).length, 8);
    for (const value of Object.values(profile.style)) assert.match(value, /^#[0-9a-f]{6}$/i);
    for (const background of ['background', 'surface', 'highlight', 'accent-soft']) {
      for (const foreground of ['text', 'muted']) {
        assert.ok(contrast(palette(foreground), palette(background)) >= 4.5, `${foreground} on ${background}`);
      }
    }
    for (const background of ['surface', 'accent-soft']) {
      assert.ok(contrast(palette('accent'), palette(background)) >= 4.5, `control text on ${background}`);
    }
  });
  test(`${profile.label}: control boundaries and focus colors meet 3:1`, () => {
    for (const background of ['background', 'surface', 'accent-soft', 'highlight']) {
      assert.ok(contrast(palette('accent'), palette(background)) >= 3, `focus on ${background}`);
      assert.ok(contrast(palette('highlight-border'), palette(background)) >= 3, `selected boundary on ${background}`);
    }
  });
}

test('High Distinction / Monochrome uses neutral gray tones throughout the palette', () => {
  for (const color of Object.values(getColorVisionProfile('monochrome').style)) {
    const channels = color.slice(1).match(/../g);
    assert.ok(channels.every(channel => channel === channels[0]), color);
  }
});
