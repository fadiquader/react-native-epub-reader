import bridge from './bridge';
import epub from './epub';

export default `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
    <title>epubjs</title>
    <style>
        body {
            margin: 0;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent; /* For some Androids */
        }
        .epub-container {
          margin: 0;
          -webkit-scroll-snap-type: mandatory;
          -webkit-scroll-snap-points-x: repeat(100%);
          -webkit-overflow-scrolling: touch;
        }
    </style>
</head>
<body>

<script type="text/javascript">
    ${epub}
</script>
<script type="text/javascript">
    ${bridge}
</script>
</body>
</html>
`