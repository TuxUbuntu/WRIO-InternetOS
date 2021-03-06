import React from 'react';
import normURL from './utils/normURL';
import PlusActions from './actions/PlusActions.js';
import {CrossStorageFactory} from '../../core/store/CrossStorageFactory.js';

var storage = CrossStorageFactory.getCrossStorage();

class GenericListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    gotoUrl(e) {
        e.preventDefault();
        PlusActions.clickLink.trigger(this.props.data);
    }

}

GenericListItem.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = GenericListItem;