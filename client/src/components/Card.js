import React, {Component} from 'react';


class ReactGridComponent extends Component {


    render() {
        return (
            <div className="module" key={this.props.key} onClick={this.props.handler}><div className="card-module">{this.props.value}</div></div>
        )
    }
}