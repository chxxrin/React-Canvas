# React JS 기반 Canvas Application
### 주요 기능
I. 브러쉬 선택
- 선택한 브러쉬 종류는 React의 useState로 관리한다.
- <select>
- 사용자가 선택을 변경할 때 업데이트 되도록 했다. (`onChange={(e) => setBrushType(e.target.value)}`)
- `draw` 함수 내에서 브러쉬 종류에 따라 서로 다른 로직을 실행한다.
1. Pen
2. Pencil
3. Spray
4. Paint
5. Brush Pen

II. 브러쉬 색깔 선택
- color picker UI를 제공하여 사용자가 색상을 선택할 수 있도록 한다.
- 선택한 색상은 React의 useState로 관리한다.
- 초기값은 'black'
- brushColor 상태는 캔버스에서 브러쉬를 그릴 때 ctx.strokeStyle로 사용된다. (`ctx.strokeStyle = brushColor;`)

III. 브러쉬 크기 선택
- 선택한 브러쉬 크기는 React의 useState로 관리한다.
- <input>
- 사용자가 입력한 값에 대해 관리되도록 했으며 문자열을 숫자로 변환하여 저장한다. (`onChange={(e) => setBrushSize(Number(e.target.value))}`)
- 브러쉬 크기는 draw 함수에서 ctx.lineWidth로 적용된다. (`ctx.lineWidth = brushSize;`)

IV. PNG로 저장
- HTMLCanvasElement의 `toDataURL` 메서드를 활용해 그림을 Base64 인코딩된 image data로 변환한다. 
- <a> 태그로 dataURL을 속성으로 설정함으로써 다운로드 기능을 구현한다. 
- `link.click()`로 가상의 클릭 이벤트를 실행해 파일 다운로드를 유도한다.
<img src="https://github.com/user-attachments/assets/9956e0c5-359a-4190-8629-d7686ba28a7b" alt="canvas application" width="400" />
