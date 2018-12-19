import { Injectable, OnInit } from "@angular/core";
import { Vector3 } from "three-full";
import { Easing, Tween, autoPlay } from "es6-tween";

export class WrappedTween {
  private tween: Tween;

  constructor(tween: Tween) {
    this.tween = tween;
  }

  start() {
    this.tween.start();
  }

  stop() {
    this.tween.stop();
  }
}

@Injectable({
  providedIn: "root"
})
export class TweeningService implements OnInit {
  constructor() {
    autoPlay(true);
  }

  ngOnInit(): void {}

  moveObjectTo(
    positionToSet: Vector3,
    destination: Vector3,
    travelTime: number
  ) {
    const startPosition = positionToSet.clone();
    const destinationPosition = {
      x: destination.x,
      y: destination.y,
      z: destination.z
    };
    const tween = new Tween(startPosition)
      .to(destinationPosition, travelTime)
      .on("update", ({ x, y, z }) => {
        positionToSet.set(x, y, z);
      });
    return new WrappedTween(tween);
  }
}
