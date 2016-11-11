import 'babel-polyfill';
import 'svgxuse';
import init from './init';
import factory from './factory';
import MyModule from './components/module';
import React, {Component} from 'react';
import Message from './components/message';
//import './styles/style.min.css';

var currentUserId = 'Honza', messages = [], infoStorage = {}; infoStorage.uniqueRecipients = [];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }

    sendMessage() {
        var message = {};
        message.from = currentUserId;
        message.to = document.querySelector('.header .recipient').value;
        message.content = document.querySelector('.response textarea').value;

        if (message.to && message.content) {
            const TIME_HTML = '<span class='time'>' + this.getTimestamp().time + '</span>' + '<span class='date'>' + this.getTimestamp().date + '</span>';

            this.setState({
                'messages': [
                    ...this.state.messages, {
                        'timestamp': TIME_HTML,
                        'from': message.from,
                        'to': message.to,
                        'content': message.content
                    }
                ]
            });

            this.checkNewMessages(message.to);

            document.querySelector('.response textarea').value = '';
            document.querySelector('.thread').scrollTo(0, 0);

            document.querySelector('.header .recipient').placeholder = 'Recipient';
            document.querySelector('.response textarea').placeholder = '';
        }
        else {
            document.querySelector('.header .recipient').placeholder = 'Cannot be empty.';
            document.querySelector('.response textarea').placeholder = 'Cannot be empty.';
        }
    }

    checkNewMessages(recipient) {
        /*var html = '';

        for (var i in messages) {
            var message = messages[i];

            if (message.from === recipient || message.to === recipient) {
                message.type = (message.from === currentUserId) ? 'outcomming' : 'incomming';

                html +=
                    '<div class='line'>' +
                        '<div class='message ' + message.type + ''>' +
                            '<div class='info'>' +
                                '<span class='from'>Od: ' + message.from + '</span>' +
                                '<span class='timestamp'>' + message.timestamp + '</span>' +
                            '</div>' +
                            '<p class='content'>' + message.content + '</p>' +
                        '</div>' +
                    '</div>';

                if(infoStorage.uniqueRecipients.indexOf(message.to) === -1) infoStorage.uniqueRecipients.push(message.to);
            }
        }

        document.querySelector('.thread').innerHTML = html;*/

        this.loadHistory();
    }

    loadHistory() {
        var html = '';

        for (var i in infoStorage.uniqueRecipients)
            html += '<li>' + '<a onclick=\'openThread(\"' + infoStorage.uniqueRecipients[i] + '\")\'>' + infoStorage.uniqueRecipients[i] + '</a>' + '</li>';

        document.querySelector('.history .threads').innerHTML = html;
    }

    openThread(recipient) {
        document.querySelector('.header .recipient').value = recipient;

        this.checkNewMessages(recipient);
    }

    getTimestamp() {
        const NOW = new Date(),
            years = NOW.getFullYear(),
            months = NOW.getMonth() + 1,
            days = NOW.getDate(),
            hours = NOW.getHours(),
            minutes = NOW.getMinutes();

        return {
            'time': hours + ':' + minutes,
            'date': days + '.' + months + '.' + years
        };
    }

    render() {
        return (
            <div>
                <div className='sidebar'>
                    <div className='button-container compose-message'>
                        <button>New message</button>
                    </div>

                    <div className='history'>
                        <h2>History</h2>
                        <ul className='threads'></ul>
                    </div>
                </div>

                <div className='chat'>
                    <div className='header'>
                        <input className='recipient' type='text' placeholder='Recipient'/>
                    </div>

                    <div className='thread'>
                        {this.state.messages.filter((message) => message.to === document.querySelector('.recipient').value).map((message, i) => (<Message {...message} key={i}/>))}
                    </div>

                    <div className='response'>
                        <textarea></textarea>

                        <div className='button-container send-message'>
                            <button onClick={this.sendMessage.bind(this)}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
