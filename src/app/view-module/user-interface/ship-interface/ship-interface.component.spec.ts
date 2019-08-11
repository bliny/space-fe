import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ShipInterfaceComponent } from "./ship-interface.component";

describe("ShipInterfaceComponent", () => {
  let component: ShipInterfaceComponent;
  let fixture: ComponentFixture<ShipInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShipInterfaceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
