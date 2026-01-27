import { setUpTests } from "react-native-reanimated";
setUpTests();

import AsyncStorage from "@react-native-async-storage/async-storage";
beforeAll(() => {
	void AsyncStorage.clear();
});
