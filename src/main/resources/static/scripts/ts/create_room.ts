import type { Game } from "./types";
async function send_room_creation_info(): Promise<void> {
    let input = document.getElementById("name") as HTMLInputElement;
    let name: string = input.value;

    console.log(name);
    if (!name) {
        return;
    }

    let response = await fetch("/create-room", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": name
        })
    });

    let data: Game = await response.json();
    localStorage.setItem("gameId", data.gameId);

    window.location.href = "./game";
}
