import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        // Load the human-like dummy SVG as an image
        this.load.svg(
            "dummy",
            "data:image/svg+xml;base64," +
                btoa(`
      <svg width="50" height="100" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="20" r="12" fill="white" stroke="black" stroke-width="2" />
        <path d="M 18 35 Q 25 25 32 35 Q 33 50 30 60 Q 25 60 20 60 Q 18 50 18 35" fill="white" stroke="black" stroke-width="2"/>
        <line x1="20" y1="60" x2="12" y2="90" stroke="white" stroke-width="4" />
        <line x1="30" y1="60" x2="38" y2="90" stroke="white" stroke-width="4" />
        <line x1="17" y1="45" x2="5" y2="55" stroke="white" stroke-width="4" />
        <line x1="33" y1="45" x2="45" y2="55" stroke="white" stroke-width="4" />
      </svg>
    `)
        );

        // Load a separate red dot SVG
        this.load.svg(
            "redDot",
            "data:image/svg+xml;base64," +
                btoa(`
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="10" fill="red" />
      </svg>
    `)
        );
    }

    create() {
        // Start the main game scene after loading assets
        console.log("Preloader scene completed, transitioning to MainGame...");
        this.scene.start("MainMenu");

        // Optionally, you can add the red dot here for testing
        const redDot = this.add.image(100, 100, "redDot");
    }
}

