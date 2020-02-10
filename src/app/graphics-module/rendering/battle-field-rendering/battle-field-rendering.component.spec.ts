import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleFieldRenderingComponent } from './battle-field-rendering.component';

describe('BattleFieldRenderingComponent', () => {
  let component: BattleFieldRenderingComponent;
  let fixture: ComponentFixture<BattleFieldRenderingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleFieldRenderingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleFieldRenderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
