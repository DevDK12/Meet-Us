import { FC } from 'react';
import { Text, TextStyle, Platform, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h6' | 'h7';
type PlatformType = 'android' | 'ios';


type CustomTextProps = {
    variant?: Variant;
    fontFamily?: 
    "OpenSans-Bold" | 
    "OpenSans-Regular" |
    "OpenSans-SemiBold" |
    "OpenSans-Medium" |
    "Roboto-Medium" |
    "Roboto-Regular";
    color?: string;
    fontSize?: number;
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
    numberOfLines?: number;
    onLayout?: (event: any) => void;
}


//_ Font size for each platform
//* Android have usually bigger font size than iOS

const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
    h1: { android: 24, ios: 22 },
    h2: { android: 22, ios: 20 },
    h3: { android: 20, ios: 18 },
    h4: { android: 18, ios: 16 },
    h5: { android: 16, ios: 14 },
    h6: { android: 12, ios: 10 },
    h7: { android: 10, ios: 9 },
};



const CustomText : FC<CustomTextProps> = ({
    variant,
    fontFamily = 'OpenSans-Regular',
    color,
    fontSize,
    style,
    children,
    numberOfLines,
    onLayout,
    ...props
}) => {

    let computeFontsize:number = Platform.OS === 'android' ? RFValue(fontSize || 12) : RFValue(fontSize || 10);

    if(variant && fontSizeMap[variant]){
        const defaultFontSize = fontSizeMap[variant][Platform.OS as PlatformType];
        computeFontsize = RFValue(fontSize || defaultFontSize);
    }

    const fontFamilyStyle = {
        fontFamily,
    };

    return (
        <Text
            onLayout={onLayout}
            numberOfLines={numberOfLines === undefined ? undefined : numberOfLines}
            style={[
                styles.text,
                {
                    color: color  || Colors.text, 
                    fontSize: computeFontsize
                },
                fontFamilyStyle,
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        textAlign: 'left',
    }
});


export default CustomText;