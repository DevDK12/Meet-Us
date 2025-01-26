import { useState } from "react";
import { LayoutChangeEvent } from "react-native";

export type TContainerDimensions = {
    width: number;
    height: number;
}

export const useContainerDimensions = () => {
    const [containerDimensions, setContainerDimensions] = useState<TContainerDimensions | null>(null);

    const onContainerLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerDimensions({ width, height });
    }


    return { containerDimensions, onContainerLayout };
}