/**
 * Created by wangjiewen on 14-12-30.
 */

var Matrix = {

    init: function () {
        var self = this;
//        var m = [
//            [1, 1, 1, 0],
//            [0, 0, 1, 1],
//            [4, 2, 1, 1]
//        ];
        var pointList = [
            [1, 0],
            [0, 1],
            [2, 1]
        ];
        var pLen = pointList.length;
        var matrix = [];
        for(var i = 0; i < pLen; i++){
            var tmp = [];
            for(var k = 2; k >= 0; k--){
                tmp.push(Math.pow(pointList[i][0], k));
            }
            tmp.push(pointList[i][1]);
            matrix.push(tmp);
        }

        var alpha = self.solve(matrix);
        debugger
    },

    /**
     * 通过矩阵解多元一次线性方程
     * @param m 增广矩阵
     * @returns {Array}
     */
    solve: function (m) {
        var self = this;
        //从左至右, 逐列处理选第1列中一个非零元,用它将第1列其余元素化为0,
        //再此行交换到第1行第1行第1列就不再动了继续第2列
        var col = m[0].length;
        var row = m.length;
        var lastNoneZeroRow = 0;//上一次的非0行
        var fistNoneZeroRow = -1;//当前列的第一个非0元素所在行
        for(var j = 0; j < col; j++){
            fistNoneZeroRow = self.selectRow(m, lastNoneZeroRow, j);
            if(fistNoneZeroRow == -1){
                continue;
            }
            for(var i = 0; i < row; i++){
                if(i == fistNoneZeroRow){
                    continue;
                }

                //每一行的比率
                var ratio = m[i][j] / m[fistNoneZeroRow][j];
                if(ratio == 0){
                    continue;
                }
                for(var k = j; k < col; k++){
                    m[i][k] -= ratio * m[fistNoneZeroRow][k];
                }
            }

            if(lastNoneZeroRow != fistNoneZeroRow){
                self.swap(m, fistNoneZeroRow, lastNoneZeroRow);
            }
            lastNoneZeroRow++;

        }

        var alpha = [];
        for(i = 0; i < row; i++){
            for(j = 0; j < col; j++){
                if(m[i][j] != 0){
                    alpha.push(m[i][col - 1] / m[i][j]);
                    break;
                }
            }
        }

        return alpha;
    },

    selectRow: function (matrix, lastNoneZeroRow,  j) {
        var len = matrix.length;
        for(var i = lastNoneZeroRow; i < len; i++){
            if(matrix[i][j] != 0){
                return i;
            }
        }
        return -1;
    },

    swap: function (matrix, i, j) {
        var len = matrix[0].length;
        for(var k = 0; k < len; k++){
            var t = matrix[i][k];
            matrix[i][k] = matrix[j][k];
            matrix[j][k] = t;
        }
    }
}