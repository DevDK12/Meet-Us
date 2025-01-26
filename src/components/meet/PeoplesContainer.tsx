import { View, Text } from 'react-native'
import { TContainerDimensions } from '../../hooks/useContainerDimensions';
import { FC } from 'react';


type PeoplesContainerProps = {
    people: any[];
    containerDimensions: TContainerDimensions;
}

const PeoplesContainer: FC<PeoplesContainerProps> = ({ people, containerDimensions }) => {
    return (
        <View>
            <Text>PeoplesContainer</Text>
        </View>
    )
}
export default PeoplesContainer