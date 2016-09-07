# DailyXKCD
A module for MagicMirror<sup>2</sup> that displays the daily XKCD web comic.

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation
  1. Clone this repo into your `modules` directory.
  2. Create an entry in your `config.js` file to tell this module where to display on screen.
  
 **Example:**
```
 {
    module: 'DailyXKCD',
	position: 'top_left',
	config: {
		invertColors: true	
	}
 },
```

## Config
| **Option** | **Description** |
| --- | --- |
| `invertColors` | Set to `true` to invert the colors of the comic to white on black for a darker feel. |
| `titleFont` | Set a custom font format, default is `large light bright`. To set the size use one of `xsmall small medium large xlarge`, for boldness one of `thin light regular bold`, and to adjust brightness one of `dimmed normal bright`. |
| `showAltText` | Set to `true` to show the alt text (tooltip on the original comic). |
