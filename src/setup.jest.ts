
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
// @ts-expect-error idk why this next line doens't work
global.TextDecoder = TextDecoder;