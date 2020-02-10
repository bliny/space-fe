import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CameraService} from '../../services/camera-service';

import * as THREE from "three-full";
import {RenderingService} from '../../services/rendering-service';

@Component({
  selector: 'battle-field-rendering',
  templateUrl: './battle-field-rendering.component.html',
  styleUrls: ['./battle-field-rendering.component.scss']
})
export class BattleFieldRenderingComponent implements OnInit {

  @ViewChild("battlefieldRendering")
  battlefieldRendering: ElementRef;

  scene: THREE.Scene;
  renderer;
  camera;
  composer;
  rayCaster = new THREE.Raycaster();

  constructor(
    private readonly cameraService: CameraService,
    private readonly rendererService: RenderingService) { }

  ngOnInit() {
    this.scene = new THREE.Scene();
    this.cameraService.getCamera().subscribe( camera => {
      this.camera = camera;

      this.cameraService.createControls(
        camera,
        this.battlefieldRendering.nativeElement
      );

      this.rendererService.getRenderer().subscribe( renderer => {
        this.renderer = renderer;

        const geometry = new THREE.PlaneGeometry( 5, 20, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );

        var material2 = new THREE.MeshPhongMaterial( {
          color: 0xff0000,
          polygonOffset: true,
          polygonOffsetFactor: 1, // positive value pushes polygon further away
          polygonOffsetUnits: 1
        } );
        var mesh2 = new THREE.Mesh( geometry, material2 );
        this.scene.add( mesh2 )

// wireframe
        var geo2 = new THREE.EdgesGeometry( mesh2.geometry ); // or WireframeGeometry
        var mat2 = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 80 } );
        var wireframe2 = new THREE.LineSegments( geo2, mat2 );
        mesh2.add( wireframe2 );


        const renderScene = new THREE.RenderPass(this.scene, this.camera);

        var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );

        var copyShader = new THREE.ShaderPass(THREE.CopyShader);
        copyShader.renderToScreen = true;


        var bloomStrength = 2;
        var bloomRadius = 0;
        var bloomThreshold = 0.1;
        var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(10, 10), 			bloomStrength, bloomRadius, bloomThreshold);

        this.composer = new THREE.EffectComposer(this.renderer);

        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.composer.addPass(renderScene);


        this.composer.addPass(bloomPass);
        this.composer.addPass(effectFXAA);
        this.composer.addPass(effectFXAA);
        this.composer.addPass(copyShader);

        let x = 0;
        let y= 0;
        let z= 0;
        let radius = 200;
        for(let j = 0; j< 5; j++){

          for(let i=0; i<10;i++){
            const pts = [];

            pts.push(new THREE.Vector3(x+0, y+radius, z));
            pts.push(new THREE.Vector3(x+radius*0.866, y+radius*0.5, z));
            pts.push(new THREE.Vector3(x+radius*0.866, y-radius*0.5, z));
            pts.push(new THREE.Vector3(x+0, y-radius, z));
            pts.push(new THREE.Vector3(x-radius*0.866, y-radius*0.5, z));
            pts.push(new THREE.Vector3(x-radius*0.866, y+radius*0.5, z));
            x+= (radius*1.732);
            const hex = new THREE.Shape(pts);
            https://github.com/anvaka/ngraph.path
            const geometryhex = new THREE.ShapeGeometry(hex);
            material.visible=false;

            const hecccc = new THREE.Mesh( geometryhex, material );
            hecccc.name= "ko: " + j +  "-"+ i;
            const geo23 = new THREE.EdgesGeometry( hecccc.geometry ); // or WireframeGeometry
            //var mat2 = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 80 } );
            const wireframe23 = new THREE.LineSegments( geo23, mat2 );


            this.scene.add(hecccc)
            this.scene.add( wireframe23 );
          }
          console.log( j%2)
          y+= radius *1.5 ;
          if( j%2 ===0){
            console.log('oszta')
            x = -1* (radius * 0.866)
          }else{
            x=0;
          }

        }


        this.animate();
      })




    })
  }

  @HostListener("mousedown", ["$event"])
  onMousedown(event) {
    console.log('yolo')
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.rayCaster.setFromCamera(mouse, this.camera);

    const intersects = this.rayCaster.intersectObjects(this.scene.children);

    //this.outlinePass.selectedObjects.length = 0;
    if (
      intersects.length > 0 && intersects[0].object.name !== 'floor' && intersects[0].object.name !== 'background'

    ) {

      console.log(intersects);

      //this.outlinePass.selectedObjects.push(intersects[0].object);
      //this.cameraService.moveCameraToObject(intersects[0].object);
    }
  }


  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render( this.scene, this.camera);
    this.cameraService.update();

    const time = Date.now() * 0.0005;

  }

}
