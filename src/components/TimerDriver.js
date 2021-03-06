import React from 'react';
import TimerDisplay from './TimerDisplay';
import { Modal, Button } from "semantic-ui-react";
import Beeper from './Beeper';

class TimerDriver extends React.Component {
    constructor(props) {
        super(props);

        this.beeper = new Beeper();

        this.state = {
            endCycleAt: Date.now() + (this.props.prepareTime * 1000),
            currentTime: Date.now(),
            secondsLeft: this.props.prepareTime,
            restingDuration: this.props.initialRestingDuration * 1000,
            climberActivity: "Prepare",
            currentCycleIndex: 0,
            lastCycleIndex: this.props.cycles,
            open: false,
            pause: false
        };
    };

    componentDidUpdate(prevProps, nextState) {
        if(this.state.open) {
            if(!this.state.pause) {
                if (nextState.secondsLeft !== this.state.secondsLeft) {
                    this.beepAndVibrate();
                };
                this.countdown();
            };
        };
    };

    setPause = () => {
        this.setState({ 
            pause: !this.state.pause,
            endCycleAt: Date.now() - (this.state.secondsLeft * 1000),
            currentTime: Date.now()
        });
    };

    close = () => this.setState({ open: false });

    resetTimer = () => {
        this.setState({
            endCycleAt: Date.now() + (this.props.prepareTime * 1000),
            currentTime: Date.now(),
            secondsLeft: this.props.prepareTime,
            restingDuration: this.props.initialRestingDuration * 1000,
            climberActivity: "Prepare",
            currentCycleIndex: 0,
            lastCycleIndex: this.props.cycles,
            open: true,
            pause: false
        });
    };

    beepAndVibrate = () => {
        if (this.state.secondsLeft <= 0) {
            this.beeper.start(600);
            navigator.vibrate(700);

            this.changeActivity();
        } 
        else if (this.state.secondsLeft <= 3) {
            this.beeper.start(250);
            navigator.vibrate(250);
        };
    }

    countdown = () => {
        setTimeout(() => {
            this.setState({
                currentTime: Date.now(),
                secondsLeft: Math.ceil((this.state.endCycleAt - this.state.currentTime) / 1000),
            });
        }, 100);
    };
    

    changeActivity = () => {
        const activities = ["Prepare", "Climbing", "Resting", "Finished"];
        
        if (this.state.currentCycleIndex + 1 === this.state.lastCycleIndex) {
            this.close();
        }
        else if ((this.state.currentCycleIndex + 1) % 2 !== 0) {
            this.setState({
                endCycleAt: Date.now() + (this.props.timeLeft * 1000),
                currentTime: Date.now(),
                secondsLeft: Math.ceil((this.state.endCycleAt - this.state.currentTime) / 1000),
                climberActivity: activities[1],
                currentCycleIndex: this.state.currentCycleIndex + 1
            });
        }
        else {
            const restingTime = this.state.restingDuration;

            const futureRest = Math.round(restingTime - (restingTime * (this.props.reduceRestByPercent / 100))) || 1;

            this.setState({
                endCycleAt: Date.now() + restingTime,
                currentTime: Date.now(),
                secondsLeft: Math.ceil((this.state.endCycleAt - this.state.currentTime) / 1000),
                restingDuration: futureRest,
                climberActivity: activities[2],
                currentCycleIndex: this.state.currentCycleIndex + 1
            });
        };
    };

    render() {
        
        return (
            <Modal
                open={this.state.open}
                onClose={this.close}
                trigger={
                    <Button onClick={this.resetTimer} 
                        color='green' 
                        size='massive' 
                        fluid 
                        circular>
                        Start
                    </Button>
                }
            >
                <Modal.Header>
                    Interval
                    <Button 
                        inverted
                        circular
                        color='red'
                        floated='right'
                        attached='bottom'
                        onClick={this.close}>
                        Close
                    </Button>
                </Modal.Header>

                <Modal.Content>
                    <TimerDisplay 
                        lastCycleIndex={this.state.lastCycleIndex}
                        currentCycleIndex={this.state.currentCycleIndex}
                        climberActivity={this.state.climberActivity}
                        secondsLeft={this.state.secondsLeft}
                        setPause={this.setPause}
                        isPauseActive={this.state.pause}
                    />
                </Modal.Content>

            </Modal>
                
        );
    };

};

export default TimerDriver;