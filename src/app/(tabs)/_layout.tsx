import { Tabs } from 'expo-router';

import { TabBar } from '@/components/navigation/tab-bar';

/**
 * Tab order is declared here; labels and icons live in the tab bar so this file
 * stays a pure route manifest.
 */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="subjects" />
      <Tabs.Screen name="upload" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
