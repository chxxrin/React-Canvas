# React JS 기반 Canvas Application
### 주요 기능
I. 브러쉬 선택
- 상태 관리: 선택한 브러쉬 종류는 React의 useState로 관리한다.
- 업데이트: 사용자가 브러쉬 종류를 변경하면 즉시 업데이트 한다.(`onChange={(e) => setBrushType(e.target.value)}`)
- 그리기 로직: draw 함수에서 선택된 브러쉬 종류에 따라 서로 다른 로직을 실행한다.
- 브러쉬 종류
1. Pen
2. Pencil
3. Spray
4. Paint
5. Brush Pen

II. 브러쉬 색깔 선택
- UI 제공: Color picker를 통해 사용자가 색상을 선택한다.
- 상태 관리: React useState로 색상을 관리한다.
- 초기값: 기본값은 "black"
- 적용: 선택된 색상은 ctx.strokeStyle로 적용되어 브러쉬 색상을 결정한다.(`ctx.strokeStyle = brushColor;`)

III. 브러쉬 크기 선택
- 슬라이더를 통한 조정
`const adjustBrushSize = (e) => {
  setBrushSize(Math.round((e.target.value / 100) * 50));
};`
- 로직
1. 슬라이더 입력 처리
- 사용자가 슬라이더를 움직이면 e.target.value를 통해 현재 값(1~100)을 가져온다.

2. 브러쉬 크기 계산
- 슬라이더 값이 `(e.target.value / 100) * 50`으로 변환되어 브러쉬 크기를 정밀하게 조정하도록 한다.

3. 소수점 반올림
- 브러쉬 크기를 정수로 설정하기 위해 `Math.round()`로 반올림하여 정수로 값을 가져온다.

4. 상태 업데이트
- setBrushSize를 호출하여 brushSize 상태를 업데이트하고 이후 그 값이 브러쉬의 두께(ctx.lineWidth)에 반영되도록 한다.

IV. 지우기 기능
- 오른쪽 마우스를 눌렀을 때 지우기 기능을 활성화하여 브러쉬의 색상을 흰색으로 설정하여 그림을 지우는 효과를 제공한다.

1. 오른쪽 마우스 클릭으로 활성화
- `e.button:` 에서 `0:왼쪽클릭`, `1:휠 클릭`, `2:오른쪽클릭`을 통해 `e.button === 2` 조건으로 오른쪽 클릭을 감지하고 `eraserMode`를 `true`로 설정되어 브러쉬가 지우기 모드로 전환된다. 
`if (e.button === 2) {
  setEraserMode(true);
} else {
  setEraserMode(false);
}
`

2. 지우기 효과
- eraserMode가 활성화되었을 때 브러쉬 색상(ctx.strokeStyle)을 캔버스 배경색과 동일한 흰색("#FFFFFF")으로 설정함으로써 지우는 효과를 구현한다.
`ctx.strokeStyle = "#FFFFFF";`

V. PNG로 저장
1. 이미지 데이터 변환
- HTMLCanvasElement의 `toDataURL` 메서드를 활용해 그림을 Base64 인코딩된 image data로 변환한다. 
2. 파일 다운로드
- <a> 태그로 dataURL을 속성으로 설정함으로써 다운로드 기능을 구현한다. 
- `link.click()`로 가상의 클릭 이벤트를 실행해 파일 다운로드를 유도한다.
`const saveAsImage = () => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "drawing.png";
  link.click();
};
`


VI. 도전과제
1. Paint 기능
- 목표: 경계선을 기준으로 클릭한 위치를 채우는 기능
- 구현: floodFill 알고리즘으로 클릭한 위치에서 동일한 색상을 기준으로 채우기
`floodFill(e.nativeEvent.offsetX, e.nativeEvent.offsetY, brushColor);`

2. 지우기와 브러쉬 크기 통합
- `ctx.lineWidth = brushSize;`
- 지우기 모드에서도 브러쉬 크기가 슬라이더 값에 따라 반영되도록 구현했다.
- 오른쪽 클릭으로 간편하게 지우기 모드를 활성화하고, 왼쪽 클릭으로 원래 브러쉬 기능을 복원했다.