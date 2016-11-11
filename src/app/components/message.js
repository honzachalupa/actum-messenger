import React, {Component} from "react";

class Message extends Component {
    render() {
        return (
            <div className="line">
                <div className={"message " + this.props.type}>
                    <div className="info">
                        <span className="from">Od: {this.props.from}</span>
                        <span className="timestamp">{this.props.timestamp}</span>
                    </div>
                    <p className="content">{this.props.content}</p>
                </div>
            </div>
        );
    }
}

export default Message;
