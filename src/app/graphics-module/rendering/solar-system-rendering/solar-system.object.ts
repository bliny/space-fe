import { SpaceObjectType } from "../../../control-module/domail/SpaceObject";

export class SolarSystemObject {
  selectedObjectId: string;
  clickedOnSameObject: boolean;
  clickPositionX: number;
  clickPositionY: number;
  type: SpaceObjectType;
}
