import React from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
import PlusStore from './stores/PlusStore.js';
import UserStore from '../../core/store/UserStore.js';
import actions from './actions/PlusActions.js';
import ActionMenu from './actions/menu';
import StoreMenu from './stores/menu';
import classNames from 'classnames';
import List from './List';
import sortBy from 'lodash.sortby';
import PlusButton from './PlusButton.js';


class RightBar extends React.Component {
    constructor(props) {
        super(props);
        this.onStateChange = this.onStateChange.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            active: false,
            jsonld: {},
            fixed: false,
            height:"auto"
        };
        this.scrollPosition = 0;
    }

    onStateChange(jsonld) {
     //   console.log(jsonld);
        this.setState({
            jsonld: jsonld
        });
    }

    onToggleMenu(data, fixed) {
        this.setState({
            active: data,
            fixed: fixed
        });
    }

    componentDidMount() {
        this.scrollHandler();
        ActionMenu.leftHeight.listen((param) => {
            var pList = document.getElementById('tabScrollPosition');
            if (pList !== undefined) {
                pList.style.height = param;
            }
         //s   console.log("Got leftHeight",pList.style.height);

        });
    }

    onScroll() {
        this.refs['scrollElement'].scrollTop = this.scrollPosition;
    }

    scrollHandler() {
        this.refs['scrollElement']
            .addEventListener('scroll', (event)=> {
                if(event.target.scrollTop) {
                    this.scrollPosition=event.target.scrollTop;
                }
            });
    }

    componentWillMount() {
        this.listenPlus = PlusStore.listen(this.onStateChange);
        StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
        StoreMenu.listenTo(ActionMenu.refresh, this.onRefresh);
        actions.read();
    }

    componentDidUpdate() {
        document.getElementById('tabScrollPosition')
            .scrollTop = Plus.checkActiveHeight(this.state.jsonld);
        this.onScroll();
    }

    componentWillUnmount() {
        this.listenPlus();
    }

    onRefresh(){
        this.forceUpdate();
    }

    static checkActiveHeight(data) {
        if (Object.keys(data).length > 0) {
            return (Object.keys(data).map((name, i) => {
                    return (data[name].active == true) ? i : null;
                }).filter(Number)[0] + 1) * 40;
        } else {
            return 0;
        }
    }

    static checkActive(data) {
        var hasActive, childActive;
        if (data) {
            Object.keys(data).forEach((name) => {
                if (data[name].active) {
                    hasActive = true;
                } else {
                    if (data[name].children) {
                        var children = data[name].children;
                        Object.keys(children).forEach((childName) => {
                            if (children[childName].active) {
                                hasActive = true;
                            }
                        });
                    }
                }
            });
        }
        return !hasActive;
    }

    render() {

        if (this.state === null) {
            return null;
        }

        return this.generateLeft(this.content);
    }

    generateLeft(component) {
        var activePlus = Plus.checkActive(this.state.jsonld);
        var className = classNames({
            'navbar-collapse in unselectable': true,
            'active': this.state.active,
            'fixed': this.state.fixed
        });
        return (<nav className={className} unselectable="on">
            <div className="navbar-header" ref="scrollElement" id="tabScrollPosition">
                {component}
            </div>
            <PlusButton data={{ name: 'plus' }} active={activePlus} />
        </nav>);
    }
}


RightBar.propTypes = {

};


export class Plus extends RightBar {


    render() {
        if (this.state === null) {
            return null;
        }
        this.content = <List data={this.state.jsonld} />;
        return this.generateLeft(this.content);
    }

}

Plus.propTypes = {

};


export class Users extends RightBar {

    constructor(props) {
        super(props);
        this.state.users = {};
    }

    componentWillMount() {
        this.listenStore = UserStore.listen(this.onStateChange);
    }


    componentWillUnmount() {
        this.listenStore();
    }

    onStateChange(usersState) {
        this.setState({
            users: usersState.users
        });
    }

    render() {
        if (this.state === null) {
            return null;
        }
        this.content = <List data={this.state.users} />;
        return this.generateLeft(this.content);
    }

}

Users.propTypes = {

};
