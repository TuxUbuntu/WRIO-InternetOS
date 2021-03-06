/**
 * Created by michbil on 16.03.16.
 */
import React from 'react';
import {Alert} from 'react-bootstrap';
import PlusStore from '../../widgets/Plus/stores/PlusStore.js';
import WindowActions from '../actions/WindowActions.js';

export class AlertWelcome extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            hidden: true
        };
    }

    hideAlertWelcomeByClick() {
        PlusStore.storageSetKey('hideAlertWelcome'+self.id,true);
        this.setState({
            'hidden': true
        });
    }

    componentDidMount() {
        this.getWarningState();
    }
    getWarningState() {
        WindowActions.loginMessage.listen((msg)=> {

            if (!msg.profile) {
                return;
            }

            self.id = msg.profile.id;
            PlusStore.storageGetKey('hideAlertWelcome'+self.id, (result) => {
//                console.log("DBG:",this,result);
                this.setState({
                    'hidden': result
                });
            });
        });
    }

    render() {
        var alert = ( <Alert bsStyle="warning" className="callout" onDismiss={this.hideAlertWelcomeByClick.bind(this)}>
            <h5>First time here?</h5><br/>

            <p>Pay attention to the icon above <span className="glyphicon glyphicon-transfer"></span>.
                Click it to open a side menu</p>
        </Alert>);
//        console.log(this.state);

        if (!this.state.hidden) {
            return alert;
        } else {
            return false;
        }
    }


}

AlertWelcome.propTypes = {

};

export class AlertWarning extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            hidden: true
        };
    }

    hideAlertWarningByClick (){
        PlusStore.storageSetKey('hideAlertWarning'+self.id, true);
        this.setState({
            'hidden': true
        });
    }
    getWarningState() {
        WindowActions.loginMessage.listen((msg)=> {
            self.id = msg.profile.id;
            PlusStore.storageGetKey('hideAlertWarning'+self.id, (result) => {
               // console.log("DBG:", this, result);
                this.setState({
                    'hidden': result
                });
            });
        });
    }

    componentDidMount() {
       this.getWarningState();
    }

    render () {

        if (!this.state.hidden) {
            return (<Alert bsStyle="warning" onDismiss={this.hideAlertWarningByClick.bind(this)}>
                <strong>Внимание</strong> - эксперементальный проект, в стадии разработки. Заявленные функции будут подключаться по мере его развития.
            </Alert>);
        } else {
            return false;
        }
    }


}

AlertWarning.propTypes = {

};
