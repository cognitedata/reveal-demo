import { Cognite3DModel, Cognite3DViewer, THREE } from "@cognite/3d-viewer";
import {Model3DViewer, OnRightClickNodeTreeParams, OnSelectNodeTreeParams, ThreeDNodeTree} from "@cognite/gearbox";
import * as sdk from "@cognite/sdk";
import { Button, Menu, message} from "antd";
import "antd/dist/antd.css";
import { ClickParam } from "antd/lib/menu";
import MenuItem from "antd/lib/menu/MenuItem";
import React from "react";
import "./SampleApp.css";

interface AppState {
  model?: Cognite3DModel;
  view?: Cognite3DViewer;
  selectedNode?: number;
  distance: number | null;
  visible: boolean;
  rightClickedNode?: number;
  menuStyle: {
    [_: string]: string;
  };
}


class SampleApp extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      distance: null,
      visible: false,
      menuStyle: {},
    };
    sdk.configure({
      apiKey: props.location.state.apiKey,
      project: '3ddemo',
    });
  }

  componentDidMount() {
    // Disable the right click menu when clicking outside of it
    document.addEventListener('click', () => {
      this.setState({
        visible: false,
      });
    });
  }

  onReady = (threeDviewer: Cognite3DViewer, threeDmodel: Cognite3DModel) => {
    // Get the model and view of the 3d-viewer
    this.setState({
      model: threeDmodel,
      view: threeDviewer,
    });
  };

  startMeasurement = () => {
    message.info('Click to Choose a Point');
    let start: any = null;
    const viewer = this.state.view;
    if (viewer) {
      const handleClick = (event: PointerEvent) => {
        const { offsetX, offsetY } = event;
        const intersection = viewer.getIntersectionFromPixel(offsetX, offsetY);
        if (intersection !== null) {
          // Get the location of the clicked point
          const point = intersection.point;
          if (start) {
            // If a first point has already been clicked, calulate the distance between the two points
            const vector = new THREE.Vector3(
              point.x - start.x,
              point.y - start.y,
              point.z - start.z
            );
            const someMaterial = new THREE.MeshBasicMaterial({
              color: 0xffff00,
            });
            const radius = vector.length() / 80;
            const geometry = new THREE.CylinderGeometry(
              radius,
              radius,
              vector.length(),
              32,
              32
            );
            const mesh = new THREE.Mesh(geometry, someMaterial);
            const axis = new THREE.Vector3(0, 1, 0);
            mesh.quaternion.setFromUnitVectors(
              axis,
              vector.clone().normalize()
            );
            mesh.position.copy(start);
            mesh.position.lerp(point, 0.5);
            viewer.addObject3D(mesh);
            this.setState({ distance: vector.length() });

            // Disable the click handler after the user chooses two points
            viewer.off('click', handleClick);
          } else {
            // If no point has been clicked before, store the clicked point and ask the user to choose
            // a second point
            start = point;
            message.info('Click to choose another point');
          }
        }
      };
      // Enable the click handler
      viewer.on('click', handleClick);
    }
  };

  showSubTree = async (nodeId: number) => {
    if (!this.state.model) {
      return;
    }
    const threeDmodel = this.state.model;
    const nodes = await threeDmodel.getSubtreeNodeIds(nodeId);
    nodes.forEach(num => threeDmodel.showNode(num));
  };

  hideSubTree = async (nodeId: number) => {
    if (!this.state.model) {
      return;
    }
    const threeDmodel = this.state.model;
    const nodes = await threeDmodel.getSubtreeNodeIds(nodeId);
    nodes.forEach(num => threeDmodel.hideNode(num));
  };

  zoomIn = (nodeId: number) => {
    if (!this.state.model || !this.state.view) {
      return;
    }
    const box = this.state.model.getBoundingBox(nodeId);
    // Return if the bounding box is infinite
    if (
      box.min.x + box.min.y + box.min.z === Infinity ||
      box.max.x + box.max.y + box.max.z === -Infinity
    ) {
      return;
    }
    this.state.view.fitCameraToBoundingBox(box);
  };

  showSubMenu = () => {
    return this.state.visible ? (
      <Menu
        theme="dark"
        style={this.state.menuStyle}
        onClick={(params: ClickParam) => {
          if (this.state.rightClickedNode) {
            switch (params.key) {
              case 'hide': {
                this.hideSubTree(this.state.rightClickedNode);
                break;
              }
              case 'show': {
                this.showSubTree(this.state.rightClickedNode);
                break;
              }
              case 'zoom': {
                this.zoomIn(this.state.rightClickedNode);
                break;
              }
              default:
                break;
            }
          }
        }}
      >
        <MenuItem key="hide">Hide Subtree</MenuItem>
        <MenuItem key="show">Show Subtree</MenuItem>
        <MenuItem key="zoom">Zoom In</MenuItem>
      </Menu>
    ) : (
      <></>
    );
  };

  render() {
    return (
      <div className="app">
        <div className="treeContainer">
          <ThreeDNodeTree
            modelId={6265454237631097}
            revisionId={3496204575166890}
            onSelect={(e: OnSelectNodeTreeParams) => {
              this.setState({
                selectedNode: e.key as number,
              });
            }}
            onRightClick={(e: OnRightClickNodeTreeParams) => {
              // Set the poistion where the right click menu pops up
              this.setState({
                visible: true,
                menuStyle: {
                  position: 'fixed',
                  top: `${e.event.clientY}px`,
                  left: `${e.event.clientX + 20}px`,
                },
                rightClickedNode: e.node.props.eventKey,
              });
            }}
          />
          {this.showSubMenu()}
        </div>
        <div className="modelContainer">
          <span id="model">
            <Model3DViewer
              modelId={6265454237631097}
              revisionId={3496204575166890}
              onReady={this.onReady}
              onClick={(id: number) => {
                console.log(id);
              }}
              slider = {{y: {min: -510, max: -460}}}
            />
          </span>
        </div>
        <Button onClick={this.startMeasurement}>Start Measurement</Button>
        <h3 id = "length">Length: {this.state.distance}</h3>
      </div>
    );
  }
}

export default SampleApp;

