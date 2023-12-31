const [
    btn1Dom,
    btn2Dom,
] = getDomsByIds([
    'btn1',
    'btn2',
]);

btn1Dom.AsyncClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('btn1');
};
btn2Dom.AsyncClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('btn2');
};