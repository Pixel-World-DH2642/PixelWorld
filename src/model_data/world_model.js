
//React + p5 & instance mode
//https://dev.to/christiankastner/integrating-p5-js-with-react-i0d

//Simple script tag solution
//https://avelaga.medium.com/how-to-embed-a-p5-js-sketch-in-a-react-page-101661293b09



function createWorldModel(){
    let testProperty = "this is a test";

    let worldSketch = null;

    function createWorldSketch(canvasID){
        worldSketch = new p5((s) => {
            let px = s.width/2;
            let py = s.height/2;
            let pr = 50;

            s.setup = () => {
                s.createCanvas(200, 400);
            };

            s.draw = () => {
                s.background(230, 30, 200);
                s.circle(px, py, pr * 2);
            };

        });
    }

    return {
        get testProperty(){return testProperty},
        get worldSketch(){return worldSketch}
    }
}

export const worldModel = {
    testProperty: "Yoyoyoyoyoyo",
    //set pInst()
    //get pInst(){return pInst}
}