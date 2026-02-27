# Phase 4 Testing Guide

**Date:** February 27, 2026  
**Purpose:** Step-by-step guide to locate and test all Phase 4 features

---

## 🚀 Getting Started

### Step 1: Enable the Advanced Builder

1. **Open your `.env.local` file** (or create it if it doesn't exist)
2. **Add this line:**
   ```
   NEXT_PUBLIC_ENABLE_ADVANCED_BUILDER="true"
   ```
3. **Save the file**
4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

### Step 2: Navigate to the Advanced Page Builder

1. **Go to:** `http://localhost:3000/dashboard/pages`
2. **Create a new page** or **edit an existing page**
3. **Look for pages with "v2" builder version** (or create a new page which will use v2)
4. **Click "Edit"** on a page
5. You should see the **AdvancedPageEditor** interface with:
   - Canvas in the center
   - LayersPanel on the left
   - AddElementPanel on the left (below layers)
   - Settings panel on the right (when element is selected)

---

## 📍 Where to Find Phase 4 Features

### Feature Location Map

```
AdvancedPageEditor
│
├── Canvas (Center)
│   └── Click any CONTAINER/SECTION
│       └── Opens ContainerSettings (Right Sidebar) ←── Phase 4 features are HERE
│
└── ContainerSettings (Right Sidebar)
    │
    ├── [Layout Tab]        ←── GridTemplateTool here (if grid layout)
    ├── [Spacing Tab]
    ├── [Style Tab]         ←── StickySettings here
    ├── [Effects Tab] ✨NEW ←── ParallaxSettings here
    └── [Visibility Tab]
```

---

## 🧪 Test 1: Find the Effects Tab (NEW)

**Goal:** Confirm the new Effects tab is visible

### Steps:

1. **In AdvancedPageEditor:**
   - Click on any **container** or **section** in the canvas (NOT a block like text/image)
   - Or click a container in the LayersPanel on the left

2. **ContainerSettings opens on the right**

3. **Look at the tab bar:**
   - You should see **5 tabs** (not 4):
     - Layout (📐 icon)
     - Spacing (📏 icon)
     - Style (🎨 icon)
     - **Effects (✨ sparkles icon)** ← NEW TAB
     - Visibility (👁️ icon)

4. **Click the "Effects" tab**

**✅ Expected Result:**
- Effects tab opens
- You see "Parallax Scrolling" section with ParallaxSettings component
- Below that: "Scroll Animations (Coming Soon)" and "Hover Effects (Coming Soon)" grayed out

**❌ If you don't see the Effects tab:**
- Check that you clicked a **container/section**, not a block
- Verify `.env.local` has `NEXT_PUBLIC_ENABLE_ADVANCED_BUILDER="true"`
- Restart dev server
- Make sure the page is using "v2" builder

---

## 🧪 Test 2: Test ParallaxSettings

**Goal:** Configure parallax scrolling effect

**Location:** Effects Tab → Parallax Scrolling section

### Steps:

1. **Select a container** (e.g., hero section)
2. **Click "Effects" tab**
3. **Find "Parallax Scrolling"** section at the top

### Test A: Enable/Disable Toggle

1. **Click the toggle switch** (should turn blue when ON)
2. **When OFF:** Only toggle and description visible
3. **When ON:** Full controls appear

**✅ Expected:** Toggle works, controls appear/disappear

### Test B: Quick Presets

1. **Enable parallax** (toggle ON)
2. **Click "Slow" preset button**
   - Speed should change to 0.3
   - Description updates: "Slow drift"
3. **Click "Fast" preset**
   - Speed changes to 0.8
   - Description: "Fast movement"
4. **Click "Reverse" preset**
   - Speed changes to -0.5
   - Description: "Moderate reverse"
5. **Click "3D" preset**
   - Speed: 0.5
   - Scale and Opacity toggles turn ON
   - Description mentions "with scale effect, with opacity fade"

**✅ Expected:** Each preset applies different settings instantly

### Test C: Speed Slider

1. **Drag the speed slider** from left to right
2. **Observe:**
   - Value display updates (e.g., "0.50")
   - Description text changes based on speed
   - Slider thumb moves smoothly

**✅ Expected:** Slider responsive, description updates

### Test D: Axis Selection

1. **Click "Vertical" button** (should be selected by default)
   - Button has blue border + blue background
2. **Click "Horizontal" button**
   - Button highlights, Vertical unhighlights
   - Description updates: "on the horizontal axis"
3. **Click "Both" button**
   - Description: "on the both axis"

**✅ Expected:** Only one axis selected at a time, visual feedback

### Test E: Advanced Effects

1. **Click "Show Advanced Effects"** button
2. **Two toggle switches appear:**
   - Scale Effect
   - Opacity Effect
3. **Toggle "Scale Effect" ON**
   - Description adds: ", with scale effect"
4. **Toggle "Opacity Effect" ON**
   - Description adds: ", with opacity fade"

**✅ Expected:** Toggles work, description updates

### Test F: Save Changes

1. **Configure parallax** (e.g., Slow preset, Vertical axis)
2. **Click "Save Changes"** button at bottom
3. **Settings panel closes**
4. **Reopen the same container**
5. **Go to Effects tab**

**✅ Expected:** Your parallax settings are still there (saved)

---

## 🧪 Test 3: Test StickySettings

**Goal:** Configure sticky positioning

**Location:** Style Tab → Sticky Position section (scroll down)

### Steps:

1. **Select a container** (e.g., header/navigation)
2. **Click "Style" tab**
3. **Scroll down** past Background, Border, Box Shadow
4. **Find "Sticky Position"** section (should have a border-top divider)

### Test A: Enable/Disable Toggle

1. **Click the toggle** (turns blue when ON)
2. **When OFF:** Only toggle and description
3. **When ON:** Full controls appear

**✅ Expected:** Toggle works

### Test B: Quick Presets

1. **Enable sticky** (toggle ON)
2. **Click "Header" preset**
   - Top Offset: 0
   - Z-Index updates to 50
   - Description: "Element will stick 0px from the top of the viewport"
3. **Click "Footer" preset**
   - Bottom Offset: 0
   - Top clears
   - Description: "Element will stick 0px from the bottom"
4. **Click "Sidebar" preset**
   - Top Offset: 80
   - Description: "Element will stick 80px from the top"

**✅ Expected:** Each preset applies instantly, description updates

### Test C: Offset Inputs

1. **Type in "Top Offset" field:** 20
   - Description updates: "...20px from the top..."
2. **Type in "Bottom Offset" field:** 10
   - Description updates to include bottom offset
3. **Clear Top Offset** (delete all text)
   - Only bottom description shows

**✅ Expected:** Inputs work, description reflects values

### Test D: Advanced Settings

1. **Click "Show Advanced Settings"**
2. **Left and Right offset fields appear**
3. **Z-Index slider appears**
4. **Drag Z-Index slider**
   - Value updates (0-100)
   - Slider smooth

**✅ Expected:** Advanced controls toggle visibility

### Test E: Save and Persist

1. **Configure:** Top: 0, Z-Index: 50
2. **Click "Save Changes"**
3. **Reopen container**
4. **Go to Style tab, scroll to Sticky Position**

**✅ Expected:** Settings saved (position: "sticky" in styleConfig)

---

## 🧪 Test 4: Test GridTemplateTool

**Goal:** Configure advanced CSS Grid

**Location:** Layout Tab → Advanced Grid Controls section (only visible for Grid layouts)

### Steps:

1. **Select a container**
2. **Click "Layout" tab**
3. **In LayoutPicker, select "Grid"** (not Stack or Flex)
4. **Scroll down**
5. **Find "Advanced Grid Controls"** section (appears after gap slider)

### Test A: Simple Mode Presets

1. **Verify "Simple" mode is active** (blue button)
2. **Click "2 Equal" preset**
   - Visual preview shows 2 columns
   - CSS output shows: `grid-template-columns: 1fr 1fr;`
3. **Click "3 Equal" preset**
   - Preview shows 3 columns
4. **Click "Sidebar L" preset**
   - Preview shows narrow left column + wide right
   - CSS: `250px 1fr`
5. **Click "Holy Grail" preset**
   - Preview shows 3 columns: side | center | side
   - CSS: `200px 1fr 200px`
6. **Click "Auto Fit" preset**
   - CSS: `repeat(auto-fit, minmax(250px, 1fr))`

**✅ Expected:** Each preset updates preview and CSS output instantly

### Test B: Gap Control

1. **Drag gap slider** (0-64px)
2. **Observe:**
   - Value display updates
   - Visual preview spacing changes
   - CSS output updates: `gap: Xpx;`

**✅ Expected:** Gap affects preview spacing

### Test C: Advanced Mode

1. **Click "Advanced" button**
2. **Two text inputs appear:**
   - Grid Template Columns (with current value)
   - Grid Template Rows
3. **Grid Auto Flow buttons appear** (4 buttons)
4. **Gap control with number input appears**

**✅ Expected:** Mode switches, UI changes

### Test D: Custom Template Columns

1. **In "Grid Template Columns" input, type:** `1fr 2fr 1fr`
2. **Observe:**
   - Visual preview updates (3 columns, center twice as wide)
   - CSS output updates
3. **Try:** `repeat(4, 1fr)`
   - Preview shows 4 equal columns

**✅ Expected:** Custom CSS templates work

### Test E: Grid Auto Flow

1. **Click "Row" button** (default, should be highlighted)
2. **Click "Column" button**
   - CSS output adds: `grid-auto-flow: column;`
3. **Click "Dense" button**
   - CSS output: `grid-auto-flow: dense;`

**✅ Expected:** Auto-flow selection works

### Test F: Visual Preview

1. **Configure any grid** (e.g., "3 Equal")
2. **Look at "Grid Preview" box**
3. **You should see:**
   - 6 numbered cells (1-6)
   - Blue background
   - Border outlines
   - Layout matches your columns setting

**✅ Expected:** Preview accurately represents grid

### Test G: Save Grid Configuration

1. **Set grid to "Holy Grail"**
2. **Set gap to 24px**
3. **Click "Save Changes"**
4. **Reopen container, go to Layout tab**

**✅ Expected:** Grid settings persist (in layoutConfig)

---

## 🧪 Test 5: Verify ContainerSettings Tab Count

**Goal:** Confirm all 5 tabs are present

### Steps:

1. **Select any container**
2. **Count the tabs in ContainerSettings:**
   - Layout
   - Spacing
   - Style
   - **Effects** ← NEW
   - Visibility

**✅ Expected:** 5 tabs total (was 4 before Phase 4)

---

## 🧪 Test 6: FlexboxAdvanced (Not Yet Integrated)

**Status:** Component built but not yet integrated into UI

**Note:** FlexboxAdvanced is available but not visible in ContainerSettings yet. This is expected. It will be integrated in a future phase for individual element settings within flex containers.

**To verify it exists:**

```bash
# Check file exists
ls components/builder/FlexboxAdvanced.tsx
```

**Expected:** File exists (410 lines)

**Integration Plan:** Phase 6 - Element-level settings panel

---

## 🔍 Troubleshooting

### Issue: "I don't see the Effects tab"

**Solutions:**

1. **Check environment variable:**
   ```bash
   # In .env.local
   NEXT_PUBLIC_ENABLE_ADVANCED_BUILDER="true"
   ```

2. **Restart dev server:**
   ```bash
   # Stop (Ctrl+C) then:
   npm run dev
   ```

3. **Verify you're editing a v2 page:**
   - In database, page should have `builderVersion: "v2"`
   - Create a NEW page (defaults to v2)

4. **Make sure you selected a CONTAINER:**
   - Click section/container in canvas or LayersPanel
   - NOT a block (text, image, button)

### Issue: "GridTemplateTool doesn't appear"

**Solution:** Layout type must be "Grid"

1. **Click "Layout" tab**
2. **In LayoutPicker, click "Grid" layout**
3. **Scroll down** → "Advanced Grid Controls" appears

### Issue: "StickySettings section is missing"

**Solution:** 

1. **Click "Style" tab**
2. **Scroll all the way down** (it's after Box Shadow)
3. Look for "Sticky Position" heading with border-top

### Issue: "Changes don't save"

**Check:**

1. **Click "Save Changes" button** at bottom of ContainerSettings
2. **Wait for save to complete** (button shows "Saving...")
3. **Check browser console** for errors
4. **Verify database connection** is working

---

## ✅ Test Checklist

Use this checklist to confirm all Phase 4 features:

### ContainerSettings Structure:
- [ ] 5 tabs visible (Layout, Spacing, Style, Effects, Visibility)
- [ ] Effects tab has sparkles ✨ icon
- [ ] Tabs switch correctly

### ParallaxSettings (Effects Tab):
- [ ] Enable/disable toggle works
- [ ] 4 presets apply correctly (Slow, Fast, Reverse, 3D)
- [ ] Speed slider responsive (-1 to +1)
- [ ] Axis buttons work (Vertical, Horizontal, Both)
- [ ] Advanced Effects toggle (Scale, Opacity)
- [ ] Description updates based on settings
- [ ] Settings save and persist

### StickySettings (Style Tab):
- [ ] Enable/disable toggle works
- [ ] 3 presets apply (Header, Footer, Sidebar)
- [ ] Top/Bottom offset inputs work
- [ ] Advanced settings toggle (Left, Right, Z-Index)
- [ ] Z-Index slider responsive (0-100)
- [ ] Description updates
- [ ] Settings save and persist

### GridTemplateTool (Layout Tab, Grid only):
- [ ] Section appears when Grid layout selected
- [ ] Simple mode: 11 presets work
- [ ] Gap slider updates preview and CSS
- [ ] Advanced mode switch works
- [ ] Custom template columns input works
- [ ] Grid auto-flow buttons work
- [ ] Visual preview shows 6 cells correctly
- [ ] CSS output displays correct syntax
- [ ] Settings save and persist

### Integration:
- [ ] All components render without errors
- [ ] Save/Cancel buttons work
- [ ] Settings persist after save
- [ ] No console errors
- [ ] TypeScript compilation clean

---

## 🚀 Next Steps After Testing

Once you've verified all Phase 4 features work:

1. **Report any issues** you find
2. **Ready for Phase 5:**
   - Scroll animations (fade, slide, zoom)
   - Hover effects (lift, grow, glow)
   - Click interactions
   - IntersectionObserver-based triggers

3. **Or request specific improvements** to Phase 4 features

---

## 📝 Quick Reference: Where Everything Is

| Feature | Tab | Section | When Visible |
|---------|-----|---------|-------------|
| **ParallaxSettings** | Effects | Parallax Scrolling | Always (when container selected) |
| **StickySettings** | Style | Sticky Position | Always (scroll down) |
| **GridTemplateTool** | Layout | Advanced Grid Controls | Only when layout type = Grid |
| **FlexboxAdvanced** | N/A | Not integrated yet | Future: element settings panel |

---

**Happy Testing! 🎉**

If you encounter any issues or have questions, let me know exactly what you're seeing and I'll help troubleshoot.
