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
        this.updateList = this.updateList.bind(this);
    }

    updateList(result) {
        let addresses = this.props.addressList;
        let coordinates = this.props.coordinateList;

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
                            {this.props.addressList.map((address, index) => (
                                <Draggable key={index} draggableId={index.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <li className="list-group-item">
                                                <span className="address-text">{address}</span>
                                                <a className="close-btn" href="#!"
                                                   onClick={() => this.updateList(index)}>
                                                    <Octicon icon={X}/>
                                                </a>
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
