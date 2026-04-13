# Windows 95 Theme

A retro 1990s Windows-inspired theme for BadgerPanel. Turns the panel into a teal desktop with draggable windows, a Start menu, and classic beveled UI.

## Install

1. Download `windows95.bptheme` from the [latest release](https://github.com/BadgerPanel/1990sTheme/releases)
2. In your panel, go to **Admin > Appearance > Themes**
3. Scroll down to **Layout Themes** and click **Import Theme**
4. Click **Activate**
5. Wait for the rebuild to finish (about 60 seconds)

## What it changes

- **Login page** turns into a classic Windows logon dialog
- **Dashboard** becomes a teal desktop with icons you can click to open windows
- **Server list, billing, support, account** all render inside Win95-style window frames
- **Start menu** at the bottom with navigation and admin links
- **Taskbar** with your username and a clock

Pages that aren't themed (like the admin panel) keep the standard BadgerPanel dark theme.

## Building your own theme

This theme is built on top of the BadgerPanel theme system. If you want to create your own theme or modify this one, check out the [Standard Theme](https://github.com/BadgerPanel/StandardTheme) repo. It contains the base theme files and the full development guide.

## Packaging

If you make changes and want to repackage:

```bash
zip -r windows95.bptheme theme.json pages/ layouts/ components/ styles/ w95.jpg
```

Upload the `.bptheme` file through the admin panel to test.
