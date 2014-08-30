/** @jsx React.DOM */

var React = require("react");
var Fluxxor = require("fluxxor");

var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var NewReferenceForm = require("./NewReferenceForm");
var ReferencesOverviewPane = require("./ReferencesOverviewPane");
var ReferencesDepositPane = require("./ReferencesDepositPane");
var ReferencesList = require("./ReferencesList");

var stats = require("../stats");

var References = React.createClass({
  mixins: [FluxChildMixin],

  render: function() {
    var deposit = this.props.user.user.deposit || 0;
    var summedStats = stats.sumReferenceStats(this.props.references.references);
    var available = deposit - summedStats.lockedLiabilities;

    return (
      <div>
        <div className="row">
            <div className="col-sm-6">
                <ReferencesOverviewPane stats={summedStats} />
            </div>
            <div className="col-sm-6">
                <ReferencesDepositPane deposit={deposit} available={available} />
            </div>
        </div>
        <NewReferenceForm />
        <ReferencesList title="Your References" references={this.props.references} editable={true} />
      </div>
    );
  }

});

module.exports = References;
