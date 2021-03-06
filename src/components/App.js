import React from 'react';
import CurrentSettingsDisplay from './CurrentSettingsDisplay';
import TimerSettings from './TimerSettings';
import TimerDriver from './TimerDriver';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            prepareTime: 5,
            timeLeft: 120,
            initialRestingDuration: 120,
            reduceRestByPercent: 50,
            cycles: 4 * 2
        };
        
    };

    handleDataFromSettings = (data) => {
        const prepareTime = (data.prepMinutes * 60) + data.prepSeconds;
        const timeLeft = (data.climbMinutes * 60) + data.climbSeconds;
        const initialRestingDuration = (data.restMinutes * 60) + data.restSeconds;

        this.setState({
            prepareTime: prepareTime,
            timeLeft: timeLeft,
            initialRestingDuration: initialRestingDuration,
            reduceRestByPercent: data.reduceRestByPercent,
            cycles: data.cycles * 2
        });
    };

    render() {
        
        return (
            <div id='mainContainer'>
                <CurrentSettingsDisplay
                    prepareTime={this.state.prepareTime}
                    timeLeft={this.state.timeLeft}
                    initialRestingDuration={this.state.initialRestingDuration}
                    reduceRestByPercent={this.state.reduceRestByPercent}
                    cycles={this.state.cycles}
                />
                <TimerSettings handleSubmit={this.handleDataFromSettings}></TimerSettings>
                <br></br>
                <TimerDriver
                    prepareTime={this.state.prepareTime}
                    timeLeft={this.state.timeLeft}
                    initialRestingDuration={this.state.initialRestingDuration}
                    reduceRestByPercent={this.state.reduceRestByPercent}
                    cycles={this.state.cycles}>
                </TimerDriver>
                
            </div>
        );
    };

    
};

export default App;