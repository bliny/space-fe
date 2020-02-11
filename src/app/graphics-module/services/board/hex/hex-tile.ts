import * as THREE from "three-full";

export class HexTile{

  center: THREE.Vector3;
  hexMesh: THREE.Mesh;
  wireframe: THREE.LineSegments;

  constructor(center: THREE.Vector3, radius: number, name: string){
    this.center = center;
    const edges =[];
    edges.push(new THREE.Vector3(center.x+0, center.y+radius, center.z));
    edges.push(new THREE.Vector3(center.x+radius*0.866, center.y+radius*0.5, center.z));
    edges.push(new THREE.Vector3(center.x+radius*0.866, center.y-radius*0.5, center.z));
    edges.push(new THREE.Vector3(center.x+0, center.y-radius, center.z));
    edges.push(new THREE.Vector3(center.x-radius*0.866, center.y-radius*0.5, center.z));
    edges.push(new THREE.Vector3(center.x-radius*0.866, center.y+radius*0.5, center.z));

    const hexShape = new THREE.Shape(edges);

    const hexGeometry = new THREE.ShapeGeometry(hexShape);

    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    material.visible=false;
    this.hexMesh = new THREE.Mesh( hexGeometry, material );
    this.hexMesh.name= name;
    const onlyEdge = new THREE.EdgesGeometry( this.hexMesh.geometry ); // or WireframeGeometry
    const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 80 } );
    this.wireframe = new THREE.LineSegments( onlyEdge, lineMaterial );
  }
}
