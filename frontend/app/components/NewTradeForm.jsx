/** @jsx React.DOM */

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var moment = require("moment");

var constants = require("../constants");

var NewTradeForm = React.createClass({
    mixins: [FluxChildMixin],

    getInitialState: function() {
        return {
            type: 'sell',
            category: '',
            description: '',
            price: '',
            validUntil: moment().add(constants.TRADE_VALID_DAYS, 'days').endOf('day').format("YYYY-MM-DD")
        };
    },

    render: function() {
        var enableButton = this.state.category && this.state.description && this.state.price;
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">New Trade</h3>
                </div>
                <div className="panel-body">
                    <form className="form-inline" onSubmit={this.onSubmitForm}>
                        I want to <strong>{this.state.type}</strong> a
                        {' '}
                        <select className="form-control input-large" required="required" onChange={this.onChangeCategory} value={this.state.category}>
                            <option value="" disabled="disabled">product / service...</option>
                            <option>product</option>
                            <option>service</option>
                        </select> called
                        {' '}
                        <input type="text" className="form-control" pattern=".{0,32}" placeholder="description" onChange={this.onChangeDescription} />
                        {' '}
                        for {constants.CURRENCY}
                        {' '}
                        <input type="number" min="0" step="0.01" className="form-control small" placeholder="0.00" onChange={this.onChangePrice} />
                        <p>This offer is <strong>valid for {constants.TRADE_VALID_DAYS} days</strong> (until {this.state.validUntil})
                            {' '}
                            <button type="submit" className="btn btn-default" disabled={!enableButton}>Create</button>
                        </p>
                    </form>
                </div>
            </div>
        );
    },

    onChangeCategory: function(e) {
        this.setState({category: e.target.value});
    },

    onChangeDescription: function(e) {
        this.setState({description: e.target.value});
    },

    onChangePrice: function(e) {
        this.setState({price: e.target.value});
    },

    onSubmitForm: function(e) {
        e.preventDefault();

        if (!this.state.type || !this.state.category || !this.state.description || !this.state.price) {
            return false;
        }

        var trade = {
            type: this.state.type,
            category: this.state.category,
            description: this.state.description,
            price: this.state.price,
            expiration: this.state.validUntil
        };

        if (trade.type === 'sell') {
            trade.sellerId = this.props.users.currentUserId;
        } else if (trade.type === 'buy') {
            trade.buyerId = this.props.users.currentUserId;
        }
        console.log(trade);

        this.getFlux().actions.trade.addTrade(trade);

        this.setState({category: '', description: '', price: ''});
        return false;
    }
});

module.exports = NewTradeForm;