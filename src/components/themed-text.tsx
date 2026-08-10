import { Text, TextProps } from 'react-native';
export type ThemedTextProps = TextProps & { type?: string };
export function ThemedText({ style, ...rest }: ThemedTextProps) {
  return <Text style={style} {...rest} />;
}
