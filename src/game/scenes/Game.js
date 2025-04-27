export class Game extends Phaser.Scene {
    constructor() {
        super("MainGame");
        this.dummies = null;
        this.score = 0;
        this.scoreText = null;
        this.gamePaused = false; // Track the paused state
    }

    preload() {
        // Preload assets
        this.load.image("dummy", "path_to_dummy_image.png");
    }

    create() {
        console.log("Game scene created"); // Log to confirm scene creation
        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: "20px",
            fill: "#fff",
        });

        // Create the dummies group
        this.dummies = this.physics.add.group();

        // Spawn dummies every second
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnDummy,
            callbackScope: this,
            loop: true,
        });

        // Handle shooting when clicked
        this.input.on("pointerdown", this.handleShoot, this);

        // Pause button
        this.pauseButton = this.add
            .text(50, 50, "Pause", {
                fontSize: "32px",
                fill: "#fff",
                backgroundColor: "#000",
            })
            .setInteractive()
            .on("pointerdown", this.togglePause, this);

        // Restart button
        this.restartButton = this.add
            .text(150, 50, "Restart", {
                fontSize: "32px",
                fill: "#fff",
                backgroundColor: "#000",
            })
            .setInteractive()
            .on("pointerdown", this.restartGame, this);
    }

    spawnDummy() {
        const y = 300; // Fixed Y position for horizontal line

        // Randomly decide whether to spawn at the left or right side
        const spawnSide = Phaser.Math.Between(0, 1) === 0 ? "left" : "right";

        // Set X to either far left (0) or far right (screen width)
        const x = spawnSide === "left" ? 0 : this.cameras.main.width;

        // Create the dummy at the chosen X and fixed Y
        const dummy = this.dummies.create(x, y, "dummy");

        // Set velocity towards the center horizontally
        const targetX = this.cameras.main.width / 2; // Target X position (center)
        const speed = Phaser.Math.Between(50, 100); // Random speed

        // Move towards the center of the screen
        if (spawnSide === "left") {
            // Move rightwards
            dummy.setVelocityX(speed);
        } else {
            // Move leftwards
            dummy.setVelocityX(-speed);
        }
    }

    createBloodSplatter(x, y) {
        for (let i = 0; i < 5; i++) {
            // Create a red dot at the shoot location with slight random offsets
            const blood = this.add.image(
                x + Phaser.Math.Between(-10, 10),
                y + Phaser.Math.Between(-10, 10),
                "redDot"
            );

            // Add an animation effect (scale up, fade out, then destroy)
            this.tweens.add({
                targets: blood,
                scaleX: 2, // Scale up the dot
                scaleY: 2,
                alpha: 0, // Fade out
                duration: 500, // Time for the effect
                ease: "Power2",
                onComplete: () => {
                    blood.destroy(); // Destroy the blood splatter once the animation is complete
                },
            });
        }
    }

    handleShoot(pointer) {
        // Iterate through all dummies and check if the pointer clicked on any
        this.dummies.children.iterate((dummy) => {
            // If pointer is within the bounds of the dummy's sprite
            if (dummy && dummy.active) {
                if (dummy.getBounds().contains(pointer.x, pointer.y)) {
                    dummy.destroy(); // Destroy the dummy
                    this.score += 10; // Increase score
                    this.scoreText.setText(`Score: ${this.score}`); // Update score text

                    // Trigger the blood splatter at the position of the dummy
                    this.createBloodSplatter(dummy.x, dummy.y);
                }
            }
        });
    }

    update() {
        if (this.gamePaused) {
            return; // Skip updates if the game is paused
        }

        // Check for dummies crossing the center of the screen and reduce score
        const centerX = this.cameras.main.width / 2;

        this.dummies.children.iterate((dummy) => {
            if (dummy) {
                // If the dummy crosses the center, reduce score by 10
                if (dummy.x < centerX && dummy.x > centerX - 10) {
                    this.score -= 10; // Reduce score
                    this.scoreText.setText(`Score: ${this.score}`); // Update score text
                    dummy.destroy(); // Destroy the dummy
                }
            }
        });

        // Check for dummies going off-screen and destroy them
        this.dummies.children.iterate((dummy) => {
            if (
                dummy &&
                (dummy.x < -50 || dummy.x > this.cameras.main.width + 50)
            ) {
                dummy.destroy(); // Remove the dummy if it goes off-screen
            }
        });
    }

    togglePause() {
        // Toggle the game pause state
        if (this.gamePaused) {
            this.resumeGame(); // Resume the game if it's currently paused
        } else {
            this.pauseGame(); // Pause the game if it's currently running
        }
    }

    pauseGame() {
        this.gamePaused = true;
        this.physics.world.isPaused = true; // Pause physics
    }

    resumeGame() {
        this.gamePaused = false;
        this.physics.world.isPaused = false; // Resume physics
    }

    restartGame() {
        // Reset score and dummies, and restart the scene
        this.score = 0;
        this.dummies.clear(true, true); // Clear all dummies
        this.scene.restart(); // Restart the scene, reinitializing everything
    }
}

