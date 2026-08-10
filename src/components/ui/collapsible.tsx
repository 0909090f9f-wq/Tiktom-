import { PropsWithChildren, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
export function Collapsible({ children, title }: PropsWithChildren<{ title: string }>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <Text>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View>{children}</View>}
    </View>
  );
}
