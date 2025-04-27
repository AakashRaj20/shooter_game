import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    scene: [Preloader, MainGame, Boot, MainMenu, GameOver], // Ensure this list has the right order
    physics: {
        default: "arcade", // Use arcade physics
        arcade: {
            gravity: { y: 0 }, // No gravity in the Y axis (flat world)
            debug: false, // Set to true to see physics boundaries for debugging
        },
    },
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;


