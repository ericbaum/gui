import React, { Component } from 'react';
import { Link } from 'react-router'
import {Loading} from "../../components/Loading";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import util from "../../comms/util/util";
import DeviceActions from '../../actions/DeviceActions';
import DeviceStore from '../../stores/DeviceStore';
import TemplateActions from '../../actions/TemplateActions';
import TemplateStore from '../../stores/TemplateStore';

import MaterialInput from "../../components/MaterialInput";
import Materialize from "materialize-css";
import MaterialSelect from "../../components/MaterialSelect";

function SummaryItem(props) {

    let attrs = 0;

    for(let attribute in props.device.attrs) {
        attrs += props.device.attrs[attribute].length;
    }

    return (

      <Link to={"/device/id/" + props.device.id + "/detail"}>
        <div className={"card-size card-hover lst-entry-wrapper z-depth-2 fullHeight"}>
              <div className="lst-entry-title col s12">
                  <img className="title-icon" src={"images/icons/chip-wt.png"}/>
                  <div className="title-text">
                      <span className="text"> {props.device.label} </span>
                  </div>
              </div>
              <div className="attr-list">
                  <div className="attr-area light-background">
                      <div className="attr-row">
                          <div className="icon">
                              <img src={"images/tag.png"}/>
                          </div>
                          <div className={"attr-content"}>
                              <input type="text" value={attrs} disabled={true}/>
                              <span>Properties</span>
                          </div>
                          <div className="center-text-parent material-btn right-side">
                          </div>
                      </div>
                      <div className="attr-row">
                          <div className="icon">
                              <img src={"images/update.png"}/>
                          </div>
                          <div className={"attr-content"}>
                              <input type="text" value={util.iso_to_date(props.device.created)} disabled={true}/>
                              <span>Last update</span>
                          </div>
                          <div className="center-text-parent material-btn right-side">
                          </div>
                      </div>
                      <div className={props.device.status}></div>
                  </div>
              </div>
          </div>
      </Link>
  )}


class DeviceCard extends Component {
  constructor(props) {
    super(props);
    this.filterListByName = this.filterListByName.bind(this);
    this.filterListByTemplate = this.filterListByTemplate.bind(this);
    this.applyFiltering = this.applyFiltering.bind(this);
    this.clearInputField = this.clearInputField.bind(this);

    this.filteredList = [];
    this.templates = [];

    this.state = {
      loaded: false,
      filter: "",
      filterIdTemplate: 0
    }
  }

  componentDidMount() {
    TemplateActions.fetchTemplates.defer();
  }

  componentDidUpdate() {
    if ((!this.state.loaded) && (this.props.devices !== undefined) && (Object.keys(this.props.devices).length)) {
        this.convertDeviceList();
        this.setState({loaded: true});
    }
  }

  filterListByTemplate (event) {
    if (event.target.value === "") {
      DeviceActions.fetchDevices.defer();
      this.setState({filterIdTemplate: ""});
    } else {
      DeviceActions.fetchDevicesByTemplate.defer(event.target.value);
      this.setState({filterIdTemplate: event.target.value});
    }
  }

  filterListByName (event){
    event.preventDefault();
    // if (event.target.value === "") {
      // DeviceActions.fetchDevices.defer();
      // the flicker is being caused by this so let's try remove it
    // }
    this.setState({filter: event.target.value});
  }

  convertTemplateList() {
    this.templates = [];
    for (let k in TemplateStore.state.templates) {
      if (TemplateStore.state.templates.hasOwnProperty(k)){
        this.templates.push(TemplateStore.state.templates[k]);
      }
    }
  }

  convertDeviceList() {
    if (this.state.filter != "") {
      if(event.target.value != undefined){
        var updatedList = this.filteredList.filter(function(device) {
          return device.label.includes(event.target.value);
        });
      }
      this.filteredList = updatedList;
    } else {
      this.filteredList = [];
      for (let k in this.props.devices) {
        if (this.props.devices.hasOwnProperty(k)){
          this.filteredList.push(this.props.devices[k]);
        }
      }
    }
  }

  createSelectTemplates() {
    let items = [];
    items.push(<option value="">Select Template</option>);
    for (let i = 0; i < this.templates.length; i++) {
        items.push(<option value={this.templates[i].id}>{this.templates[i].label}</option>);
    }

    return items;
  }

  applyFiltering(list){
    return Object.values(list)
  }

  clearInputField(){
    this.state.filter = "";
  }

  render() {
    if (this.props.loading) {
      return (<Loading />);
    }

  this.filteredList = this.applyFiltering(this.props.devices);
  this.convertDeviceList();

  this.convertTemplateList();

  const device_icon  = (<img src='images/icons/chip.png' />);

   let header = null;
   if (this.props.showSearchBox){
    header = <div className={"row z-depth-2 devicesSubHeader " + (this.props.showSearchBox ? "show-dy" : "hide-dy")} id="inner-header">
         <div className="col s3 m3 main-title">
           Showing {this.filteredList.length} device(s)
         </div>
         <div className="col s1 m1 header-info hide-on-small-only">
           {/* <div className="title"># Devices</div> */}
           {/* <div className="subtitle"> */}
           {/* Showing {this.filteredList.length} device(s) */}
           {/* </div> */}
         </div>
         <div className="col s4 m4">
           <label htmlFor="fld_device_name">Device Name</label>
           <input id="fld_device_name" type="text" name="Device Name" className="form-control form-control-lg" placeholder="Search" value={this.state.filter} onChange={this.filterListByName} />
         </div>
         <div className="col s4 m4 mt5">
           <MaterialSelect id="flr_templates" name="Templates" label="Templates" value={this.state.filterIdTemplate} onChange={this.filterListByTemplate}>
             {this.createSelectTemplates()}
           </MaterialSelect>
         </div>
       </div>;
   } else {
    this.filteredList = this.applyFiltering(this.props.devices);
    this.clearInputField();
   }

      return <div className="full-height relative">
          <ReactCSSTransitionGroup transitionName="devicesSubHeader"
                                   transitionLeave={true}
                                   transitionAppear={true}
                                   transitionAppearTimeout={300}
                                   transitionEnterTimeout={300}
                                   transitionLeaveTimeout={300}>
            {header}
          </ReactCSSTransitionGroup>
                {this.filteredList.length == 0 ? (
                  <div className="background-info valign-wrapper full-height">
                    <span className="horizontal-center">
                      No configured devices
                    </span>
                  </div>
                ) : (
                  <div className="col s12  lst-wrapper extra-padding">
                    {this.filteredList.map((device, idx) => (
                      <SummaryItem device={device} key={device.id} />
                    ))}
                  </div>
                )}
        </div>;
  }
}

export { DeviceCard };
