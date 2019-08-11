import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PlanetInterfaceComponent } from "./planet-interface.component";

describe("PlanetInterfaceComponent", () => {
  let component: PlanetInterfaceComponent;
  let fixture: ComponentFixture<PlanetInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlanetInterfaceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
