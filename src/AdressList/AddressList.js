import React from 'react';
import Octicon, {X} from '@primer/octicons-react';
import './AddressList.scss';
import {Droppable, Draggable, DragDropContext} from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class AddressList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addressList: this.props.addressList,
            coordinateList: this.props.coordinateList
        };
        this.updateList = this.updateList.bind(this);
    }

    updateList(result) {
        let addresses = this.state.addressList;
        let coordinates = this.state.coordinateList;

        if (typeof result != 'number') {  // при перетаскивании элемента result является объектом, при удалении - числом
            if (!result.destination) {
                return;
            }
            addresses = reorder(
                addresses,
                result.source.index,
                result.destination.index
            );
            coordinates = reorder(
                coordinates,
                result.source.index,
                result.destination.index
            )
        } else {
            addresses.splice(result, 1);
            coordinates.splice(result, 1);
        }

        this.setState({
            addressList: addresses,
            coordinateList: coordinates
        });
        this.props.updateParentStateCallback(addresses, coordinates);
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.updateList}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {this.state.addressList.map((address, index) => (
                                <Draggable key={address + index} draggableId={address} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <li className="list-group-item">
                                                <div className="text">{address}
                                                    <a className="close-btn" href="#!"
                                                       onClick={() => this.updateList(index)}>
                                                        <Octicon icon={X}/>
                                                    </a>
                                                </div>
                                            </li>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}

export default AddressList;
