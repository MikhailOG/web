import React from 'react';

const rowContext = React.createContext({
    inputChangedHandler: () => {}
});

export default rowContext;