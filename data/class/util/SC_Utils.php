<?php
/*
 * Copyright(c) 2000-2007 LOCKON CO.,LTD. All Rights Reserved.
 *
 * http://www.lockon.co.jp/
 */

/**
 * 各種ユーティリティクラス.
 *
 * 主に static 参照するユーティリティ系の関数群
 *
 * :XXX: 内部でインスタンスを生成している関数は, Helper クラスへ移動するべき...
 *
 * @package Util
 * @author LOCKON CO.,LTD.
 * @version $Id:SC_Utils.php 15532 2007-08-31 14:39:46Z nanasess $
 */
class SC_Utils {

    /**
     * サイト管理情報から値を取得する。
     * データが存在する場合、必ず1以上の数値が設定されている。
     * 0を返した場合は、呼び出し元で対応すること。
     *
     * @param $control_id 管理ID
     * @param $dsn DataSource
     * @return $control_flg フラグ
     */
    function sfGetSiteControlFlg($control_id, $dsn = "") {

        // データソース
        if($dsn == "") {
            if(defined('DEFAULT_DSN')) {
                $dsn = DEFAULT_DSN;
            } else {
                return;
            }
        }

        // クエリ生成
        $target_column = "control_flg";
        $table_name = "dtb_site_control";
        $where = "control_id = ?";
        $arrval = array($control_id);
        $control_flg = 0;

        // クエリ発行
        $objQuery = new SC_Query($dsn, true, true);
        $arrSiteControl = $objQuery->select($target_column, $table_name, $where, $arrval);

        // データが存在すればフラグを取得する
        if (count($arrSiteControl) > 0) {
            $control_flg = $arrSiteControl[0]["control_flg"];
        }

        return $control_flg;
    }

    // インストール初期処理
    function sfInitInstall() {
        // インストール済みが定義されていない。
        if(!defined('ECCUBE_INSTALL')) {
            if(!ereg("/install/", $_SERVER['PHP_SELF'])) {
                header("Location: ./install/");
            }
        } else {
            $path = HTML_PATH . "install/index.php";
            if(file_exists($path)) {
                sfErrorHeader(">> /install/index.phpは、インストール完了後にファイルを削除してください。");
            }

            // 旧バージョンのinstall.phpのチェック
            $path = HTML_PATH . "install.php";
            if(file_exists($path)) {
                sfErrorHeader(">> /install.phpはセキュリティーホールとなります。削除してください。");
            }
        }
    }

    // アップデートで生成されたPHPを読み出し
    function sfLoadUpdateModule() {
        // URL設定ディレクトリを削除
        $main_php = ereg_replace(URL_DIR, "", $_SERVER['PHP_SELF']);
        $extern_php = UPDATE_PATH . $main_php;
        if(file_exists($extern_php)) {
            require_once($extern_php);
        }
    }

    // 装飾付きエラーメッセージの表示
    function sfErrorHeader($mess, $print = false) {
        global $GLOBAL_ERR;
        if($GLOBAL_ERR == "") {
            $GLOBAL_ERR = "<meta http-equiv='Content-Type' content='text/html; charset=" . CHAR_CODE . "'>\n";
        }
        $GLOBAL_ERR.= "<table width='100%' border='0' cellspacing='0' cellpadding='0' summary=' '>\n";
        $GLOBAL_ERR.= "<tr>\n";
        $GLOBAL_ERR.= "<td bgcolor='#ffeebb' height='25' colspan='2' align='center'>\n";
        $GLOBAL_ERR.= "<SPAN style='color:red; font-size:12px'><strong>" . $mess . "</strong></span>\n";
        $GLOBAL_ERR.= "</td>\n";
        $GLOBAL_ERR.= "	</tr>\n";
        $GLOBAL_ERR.= "</table>\n";

        if($print) {
            print($GLOBAL_ERR);
        }
    }

    /* エラーページの表示 */
    function sfDispError($type) {

        require_once(CLASS_PATH . "page_extends/error/LC_Page_Error_DispError_Ex.php");

        $objPage = new LC_Page_Error_DispError_Ex();
        $objPage->init();
        $objView = new SC_AdminView();

        switch ($type) {
            case LOGIN_ERROR:
                $objPage->tpl_error="ＩＤまたはパスワードが正しくありません。<br />もう一度ご確認のうえ、再度入力してください。";
                break;
            case ACCESS_ERROR:
                $objPage->tpl_error="ログイン認証の有効期限切れの可能性があります。<br />もう一度ご確認のうえ、再度ログインしてください。";
                break;
            case AUTH_ERROR:
                $objPage->tpl_error="このファイルにはアクセス権限がありません。<br />もう一度ご確認のうえ、再度ログインしてください。";
                break;
            case INVALID_MOVE_ERRORR:
                $objPage->tpl_error="不正なページ移動です。<br />もう一度ご確認のうえ、再度入力してください。";
                break;
            default:
                $objPage->tpl_error="エラーが発生しました。<br />もう一度ご確認のうえ、再度ログインしてください。";
                break;
        }

        $objView->assignobj($objPage);
        $objView->display(LOGIN_FRAME);
        exit;
    }

    /* サイトエラーページの表示 */
    function sfDispSiteError($type, $objSiteSess = "", $return_top = false, $err_msg = "", $is_mobile = false) {

        require_once(CLASS_PATH . "page_extends/error/LC_Page_Error_Ex.php");

        // FIXME
        global $objCampaignSess;

        if ($objSiteSess != "") {
            $objSiteSess->setNowPage('error');
        }

        $objPage = new LC_Page_Error_Ex();
        $objPage->init();


        if($is_mobile === true) {
            $objView = new SC_MobileView();
        } else {
            $objView = new SC_SiteView();
        }

        switch ($type) {
            case PRODUCT_NOT_FOUND:
                $objPage->tpl_error="ご指定のページはございません。";
                break;
            case PAGE_ERROR:
                $objPage->tpl_error="不正なページ移動です。";
                break;
            case CART_EMPTY:
                $objPage->tpl_error="カートに商品ががありません。";
                break;
            case CART_ADD_ERROR:
                $objPage->tpl_error="購入処理中は、カートに商品を追加することはできません。";
                break;
            case CANCEL_PURCHASE:
                $objPage->tpl_error="この手続きは無効となりました。以下の要因が考えられます。<br />・セッション情報の有効期限が切れてる場合<br />・購入手続き中に新しい購入手続きを実行した場合<br />・すでに購入手続きを完了している場合";
                break;
            case CATEGORY_NOT_FOUND:
                $objPage->tpl_error="ご指定のカテゴリは存在しません。";
                break;
            case SITE_LOGIN_ERROR:
                $objPage->tpl_error="メールアドレスもしくはパスワードが正しくありません。";
                break;
            case TEMP_LOGIN_ERROR:
                $objPage->tpl_error="メールアドレスもしくはパスワードが正しくありません。<br />本登録がお済みでない場合は、仮登録メールに記載されている<br />URLより本登録を行ってください。";
                break;
            case CUSTOMER_ERROR:
                $objPage->tpl_error="不正なアクセスです。";
                break;
            case SOLD_OUT:
                $objPage->tpl_error="申し訳ございませんが、ご購入の直前で売り切れた商品があります。この手続きは無効となりました。";
                break;
            case CART_NOT_FOUND:
                $objPage->tpl_error="申し訳ございませんが、カート内の商品情報の取得に失敗しました。この手続きは無効となりました。";
                break;
            case LACK_POINT:
                $objPage->tpl_error="申し訳ございませんが、ポイントが不足しております。この手続きは無効となりました。";
                break;
            case FAVORITE_ERROR:
                $objPage->tpl_error="既にお気に入りに追加されている商品です。";
                break;
            case EXTRACT_ERROR:
                $objPage->tpl_error="ファイルの解凍に失敗しました。\n指定のディレクトリに書き込み権限が与えられていない可能性があります。";
                break;
            case FTP_DOWNLOAD_ERROR:
                $objPage->tpl_error="ファイルのFTPダウンロードに失敗しました。";
                break;
            case FTP_LOGIN_ERROR:
                $objPage->tpl_error="FTPログインに失敗しました。";
                break;
            case FTP_CONNECT_ERROR:
                $objPage->tpl_error="FTPログインに失敗しました。";
                break;
            case CREATE_DB_ERROR:
                $objPage->tpl_error="DBの作成に失敗しました。\n指定のユーザーには、DB作成の権限が与えられていない可能性があります。";
                break;
            case DB_IMPORT_ERROR:
                $objPage->tpl_error="データベース構造のインポートに失敗しました。\nsqlファイルが壊れている可能性があります。";
                break;
            case FILE_NOT_FOUND:
                $objPage->tpl_error="指定のパスに、設定ファイルが存在しません。";
                break;
            case WRITE_FILE_ERROR:
                $objPage->tpl_error="設定ファイルに書き込めません。\n設定ファイルに書き込み権限を与えてください。";
                break;
            case FREE_ERROR_MSG:
                $objPage->tpl_error=$err_msg;
                break;
             default:
                $objPage->tpl_error="エラーが発生しました。";
                break;
        }

        $objPage->return_top = $return_top;

        $objView->assignobj($objPage);

        if(is_object($objCampaignSess)) {
            // フレームを選択(キャンペーンページから遷移なら変更)
            $objCampaignSess->pageView($objView);
        } else {
            $objView->display(SITE_FRAME);
        }
        register_shutdown_function(array($objPage, "destroy"));
        exit;
    }

    /* 認証の可否判定 */
    function sfIsSuccess($objSess, $disp_error = true) {
        $ret = $objSess->IsSuccess();
        if($ret != SUCCESS) {
            if($disp_error) {
                // エラーページの表示
                SC_Utils::sfDispError($ret);
            }
            return false;
        }
        // リファラーチェック(CSRFの暫定的な対策)
        // 「リファラ無」 の場合はスルー
        // 「リファラ有」 かつ 「管理画面からの遷移でない」 場合にエラー画面を表示する
        if ( empty($_SERVER['HTTP_REFERER']) ) {
            // 警告表示させる？
            // sfErrorHeader('>> referrerが無効になっています。');
        } else {
            $domain  = SC_Utils::sfIsHTTPS() ? SSL_URL : SITE_URL;
            $pattern = sprintf('|^%s.*|', $domain);
            $referer = $_SERVER['HTTP_REFERER'];

            // 管理画面から以外の遷移の場合はエラー画面を表示
            if (!preg_match($pattern, $referer)) {
                if ($disp_error) SC_Utils::sfDispError(INVALID_MOVE_ERRORR);
                return false;
            }
        }
        return true;
    }

    /**
     * 文字列をアスタリスクへ変換する.
     *
     * @param string $passlen 変換する文字列
     * @return string アスタリスクへ変換した文字列
     */
    function lfPassLen($passlen){
        $ret = "";
        for ($i=0;$i<$passlen;true){
            $ret.="*";
            $i++;
        }
        return $ret;
    }

    /**
     * HTTPSかどうかを判定
     *
     * @return bool
     */
    function sfIsHTTPS () {
        // HTTPS時には$_SERVER['HTTPS']には空でない値が入る
        // $_SERVER['HTTPS'] != 'off' はIIS用
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') {
            return true;
        } else {
            return false;
        }
    }

    /**
     *  正規の遷移がされているかを判定
     *  前画面でuniqidを埋め込んでおく必要がある
     *  @param  obj  SC_Session, SC_SiteSession
     *  @return bool
     */
    function sfIsValidTransition($objSess) {
        // 前画面からPOSTされるuniqidが正しいものかどうかをチェック
        $uniqid = $objSess->getUniqId();
        if ( !empty($_POST['uniqid']) && ($_POST['uniqid'] === $uniqid) ) {
            return true;
        } else {
            return false;
        }
    }

    /* 前のページで正しく登録が行われたか判定 */
    function sfIsPrePage(&$objSiteSess, $is_mobile = false) {
        $ret = $objSiteSess->isPrePage();
        if($ret != true) {
            // エラーページの表示
            SC_Utils::sfDispSiteError(PAGE_ERROR, $objSiteSess, false, "", $is_mobile);
        }
    }

    function sfCheckNormalAccess(&$objSiteSess, $objCartSess) {
        // ユーザユニークIDの取得
        $uniqid = $objSiteSess->getUniqId();
        // 購入ボタンを押した時のカート内容がコピーされていない場合のみコピーする。
        $objCartSess->saveCurrentCart($uniqid);
        // POSTのユニークIDとセッションのユニークIDを比較(ユニークIDがPOSTされていない場合はスルー)
        $ret = $objSiteSess->checkUniqId();
        if($ret != true) {
            // エラーページの表示
            SC_Utils_Ex::sfDispSiteError(CANCEL_PURCHASE, $objSiteSess);
        }

        // カート内が空でないか || 購入ボタンを押してから変化がないか
        $quantity = $objCartSess->getTotalQuantity();
        $ret = $objCartSess->checkChangeCart();
        if($ret == true || !($quantity > 0)) {
            // カート情報表示に強制移動する
            header("Location: ".URL_CART_TOP); // FIXME
            exit;
        }
        return $uniqid;
    }

    /* DB用日付文字列取得 */
    function sfGetTimestamp($year, $month, $day, $last = false) {
        if($year != "" && $month != "" && $day != "") {
            if($last) {
                $time = "23:59:59";
            } else {
                $time = "00:00:00";
            }
            $date = $year."-".$month."-".$day." ".$time;
        } else {
            $date = "";
        }
        return 	$date;
    }

    // INT型の数値チェック
    function sfIsInt($value) {
        if($value != "" && strlen($value) <= INT_LEN && is_numeric($value)) {
            return true;
        }
        return false;
    }

    function sfCSVDownload($data, $prefix = ""){

        if($prefix == "") {
            $dir_name = SC_Utils::sfUpDirName();
            $file_name = $dir_name . date("ymdHis") .".csv";
        } else {
            $file_name = $prefix . date("ymdHis") .".csv";
        }

        /* HTTPヘッダの出力 */
        Header("Content-disposition: attachment; filename=${file_name}");
        Header("Content-type: application/octet-stream; name=${file_name}");
        Header("Cache-Control: ");
        Header("Pragma: ");

        if (mb_internal_encoding() == CHAR_CODE){
            $data = mb_convert_encoding($data,'SJIS',CHAR_CODE);
        }

        /* データを出力 */
        echo $data;
    }

    /* 1階層上のディレクトリ名を取得する */
    function sfUpDirName() {
        $path = $_SERVER['PHP_SELF'];
        $arrVal = split("/", $path);
        $cnt = count($arrVal);
        return $arrVal[($cnt - 2)];
    }




    /**
     * 現在のサイトを更新（ただしポストは行わない）
     *
     * @deprecated LC_Page::reload() を使用して下さい.
     */
    function sfReload($get = "") {
        if ($_SERVER["SERVER_PORT"] == "443" ){
            $url = ereg_replace(URL_DIR . "$", "", SSL_URL);
        } else {
            $url = ereg_replace(URL_DIR . "$", "", SITE_URL);
        }

        if($get != "") {
            header("Location: ". $url . $_SERVER['PHP_SELF'] . "?" . $get);
        } else {
            header("Location: ". $url . $_SERVER['PHP_SELF']);
        }
        exit;
    }

    // チェックボックスの値をマージ
    function sfMergeCBValue($keyname, $max) {
        $conv = "";
        $cnt = 1;
        for($cnt = 1; $cnt <= $max; $cnt++) {
            if ($_POST[$keyname . $cnt] == "1") {
                $conv.= "1";
            } else {
                $conv.= "0";
            }
        }
        return $conv;
    }

    // html_checkboxesの値をマージして2進数形式に変更する。
    function sfMergeCheckBoxes($array, $max) {
        $ret = "";
        if(is_array($array)) {
            foreach($array as $val) {
                $arrTmp[$val] = "1";
            }
        }
        for($i = 1; $i <= $max; $i++) {
            if(isset($arrTmp[$i]) && $arrTmp[$i] == "1") {
                $ret.= "1";
            } else {
                $ret.= "0";
            }
        }
        return $ret;
    }


    // html_checkboxesの値をマージして「-」でつなげる。
    function sfMergeParamCheckBoxes($array) {
        $ret = '';
        if(is_array($array)) {
            foreach($array as $val) {
                if($ret != "") {
                    $ret.= "-$val";
                } else {
                    $ret = $val;
                }
            }
        } else {
            $ret = $array;
        }
        return $ret;
    }

    // html_checkboxesの値をマージしてSQL検索用に変更する。
    function sfSearchCheckBoxes($array) {
        $max = 0;
        $ret = "";
        foreach($array as $val) {
            $arrTmp[$val] = "1";
            if($val > $max) {
                $max = $val;
            }
        }
        for($i = 1; $i <= $max; $i++) {
            if($arrTmp[$i] == "1") {
                $ret.= "1";
            } else {
                $ret.= "_";
            }
        }

        if($ret != "") {
            $ret.= "%";
        }
        return $ret;
    }

    // 2進数形式の値をhtml_checkboxes対応の値に切り替える
    function sfSplitCheckBoxes($val) {
        $arrRet = array();
        $len = strlen($val);
        for($i = 0; $i < $len; $i++) {
            if(substr($val, $i, 1) == "1") {
                $arrRet[] = ($i + 1);
            }
        }
        return $arrRet;
    }

    // チェックボックスの値をマージ
    function sfMergeCBSearchValue($keyname, $max) {
        $conv = "";
        $cnt = 1;
        for($cnt = 1; $cnt <= $max; $cnt++) {
            if ($_POST[$keyname . $cnt] == "1") {
                $conv.= "1";
            } else {
                $conv.= "_";
            }
        }
        return $conv;
    }

    // チェックボックスの値を分解
    function sfSplitCBValue($val, $keyname = "") {
        $len = strlen($val);
        $no = 1;
        for ($cnt = 0; $cnt < $len; $cnt++) {
            if($keyname != "") {
                $arr[$keyname . $no] = substr($val, $cnt, 1);
            } else {
                $arr[] = substr($val, $cnt, 1);
            }
            $no++;
        }
        return $arr;
    }

    // キーと値をセットした配列を取得
    function sfArrKeyValue($arrList, $keyname, $valname, $len_max = "", $keysize = "") {
        $arrRet = array();
        $max = count($arrList);

        if($len_max != "" && $max > $len_max) {
            $max = $len_max;
        }

        for($cnt = 0; $cnt < $max; $cnt++) {
            if($keysize != "") {
                $key = SC_Utils::sfCutString($arrList[$cnt][$keyname], $keysize);
            } else {
                $key = $arrList[$cnt][$keyname];
            }
            $val = $arrList[$cnt][$valname];

            if(!isset($arrRet[$key])) {
                $arrRet[$key] = $val;
            }

        }
        return $arrRet;
    }

    // キーと値をセットした配列を取得(値が複数の場合)
    function sfArrKeyValues($arrList, $keyname, $valname, $len_max = "", $keysize = "", $connect = "") {

        $max = count($arrList);

        if($len_max != "" && $max > $len_max) {
            $max = $len_max;
        }

        for($cnt = 0; $cnt < $max; $cnt++) {
            if($keysize != "") {
                $key = SC_Utils::sfCutString($arrList[$cnt][$keyname], $keysize);
            } else {
                $key = $arrList[$cnt][$keyname];
            }
            $val = $arrList[$cnt][$valname];

            if($connect != "") {
                $arrRet[$key].= "$val".$connect;
            } else {
                $arrRet[$key][] = $val;
            }
        }
        return $arrRet;
    }

    // 配列の値をカンマ区切りで返す。
    function sfGetCommaList($array, $space=true) {
        if (count($array) > 0) {
            $line = "";
            foreach($array as $val) {
                if ($space) {
                    $line .= $val . ", ";
                }else{
                    $line .= $val . ",";
                }
            }
            if ($space) {
                $line = ereg_replace(", $", "", $line);
            }else{
                $line = ereg_replace(",$", "", $line);
            }
            return $line;
        }else{
            return false;
        }

    }

    /* 配列の要素をCSVフォーマットで出力する。*/
    function sfGetCSVList($array) {
        $line = "";
        if (count($array) > 0) {
            foreach($array as $key => $val) {
                $val = mb_convert_encoding($val, CHAR_CODE, CHAR_CODE);
                $line .= "\"".$val."\",";
            }
            $line = ereg_replace(",$", "\r\n", $line);
        }else{
            return false;
        }
        return $line;
    }

    /* 配列の要素をPDFフォーマットで出力する。*/
    function sfGetPDFList($array) {
        foreach($array as $key => $val) {
            $line .= "\t".$val;
        }
        $line.="\n";
        return $line;
    }



    /*-----------------------------------------------------------------*/
    /*	check_set_term
    /*	年月日に別れた2つの期間の妥当性をチェックし、整合性と期間を返す
    /*　引数 (開始年,開始月,開始日,終了年,終了月,終了日)
    /*　戻値 array(１，２，３）
    /*  		１．開始年月日 (YYYY/MM/DD 000000)
    /*			２．終了年月日 (YYYY/MM/DD 235959)
    /*			３．エラー ( 0 = OK, 1 = NG )
    /*-----------------------------------------------------------------*/
    function sfCheckSetTerm ( $start_year, $start_month, $start_day, $end_year, $end_month, $end_day ) {

        // 期間指定
        $error = 0;
        if ( $start_month || $start_day || $start_year){
            if ( ! checkdate($start_month, $start_day , $start_year) ) $error = 1;
        } else {
            $error = 1;
        }
        if ( $end_month || $end_day || $end_year){
            if ( ! checkdate($end_month ,$end_day ,$end_year) ) $error = 2;
        }
        if ( ! $error ){
            $date1 = $start_year ."/".sprintf("%02d",$start_month) ."/".sprintf("%02d",$start_day) ." 000000";
            $date2 = $end_year   ."/".sprintf("%02d",$end_month)   ."/".sprintf("%02d",$end_day)   ." 235959";
            if ($date1 > $date2) $error = 3;
        } else {
            $error = 1;
        }
        return array($date1, $date2, $error);
    }

    // エラー箇所の背景色を変更するためのfunction SC_Viewで読み込む
    function sfSetErrorStyle(){
        return 'style="background-color:'.ERR_COLOR.'"';
    }

    /* DBに渡す数値のチェック
     * 10桁以上はオーバーフローエラーを起こすので。
     */
    function sfCheckNumLength( $value ){
        if ( ! is_numeric($value)  ){
            return false;
        }

        if ( strlen($value) > 9 ) {
            return false;
        }

        return true;
    }

    // 一致した値のキー名を取得
    function sfSearchKey($array, $word, $default) {
        foreach($array as $key => $val) {
            if($val == $word) {
                return $key;
            }
        }
        return $default;
    }

    function sfGetErrorColor($val) {
        if($val != "") {
            return "background-color:" . ERR_COLOR;
        }
        return "";
    }

    function sfGetEnabled($val) {
        if( ! $val ) {
            return " disabled=\"disabled\"";
        }
        return "";
    }

    function sfGetChecked($param, $value) {
        if($param == $value) {
            return "checked=\"checked\"";
        }
        return "";
    }

    function sfTrim($str) {
        $ret = ereg_replace("^[　 \n\r]*", "", $str);
        $ret = ereg_replace("[　 \n\r]*$", "", $ret);
        return $ret;
    }

    /* 税金計算 */
    function sfTax($price, $tax, $tax_rule) {
        $real_tax = $tax / 100;
        $ret = $price * $real_tax;
        switch($tax_rule) {
        // 四捨五入
        case 1:
            $ret = round($ret);
            break;
        // 切り捨て
        case 2:
            $ret = floor($ret);
            break;
        // 切り上げ
        case 3:
            $ret = ceil($ret);
            break;
        // デフォルト:切り上げ
        default:
            $ret = ceil($ret);
            break;
        }
        return $ret;
    }

    /* 税金付与 */
    function sfPreTax($price, $tax, $tax_rule) {
        $real_tax = $tax / 100;
        $ret = $price * (1 + $real_tax);

        switch($tax_rule) {
        // 四捨五入
        case 1:
            $ret = round($ret);
            break;
        // 切り捨て
        case 2:
            $ret = floor($ret);
            break;
        // 切り上げ
        case 3:
            $ret = ceil($ret);
            break;
        // デフォルト:切り上げ
        default:
            $ret = ceil($ret);
            break;
        }
        return $ret;
    }

    // 桁数を指定して四捨五入
    function sfRound($value, $pow = 0){
        $adjust = pow(10 ,$pow-1);

        // 整数且つ0出なければ桁数指定を行う
        if(SC_Utils::sfIsInt($adjust) and $pow > 1){
            $ret = (round($value * $adjust)/$adjust);
        }

        $ret = round($ret);

        return $ret;
    }

    /* ポイント付与 */
    function sfPrePoint($price, $point_rate, $rule = POINT_RULE, $product_id = "") {
        if(SC_Utils::sfIsInt($product_id)) {
            $objQuery = new SC_Query();
            $where = "now() >= cast(start_date as date) AND ";
            $where .= "now() < cast(end_date as date) AND ";

            $where .= "del_flg = 0 AND campaign_id IN (SELECT campaign_id FROM dtb_campaign_detail where product_id = ? )";
            //登録(更新)日付順
            $objQuery->setorder('update_date DESC');
            //キャンペーンポイントの取得
            $arrRet = $objQuery->select("campaign_name, campaign_point_rate", "dtb_campaign", $where, array($product_id));
        }
        //複数のキャンペーンに登録されている商品は、最新のキャンペーンからポイントを取得
        if(isset($arrRet[0]['campaign_point_rate'])
           && $arrRet[0]['campaign_point_rate'] != "") {

            $campaign_point_rate = $arrRet[0]['campaign_point_rate'];
            $real_point = $campaign_point_rate / 100;
        } else {
            $real_point = $point_rate / 100;
        }
        $ret = $price * $real_point;
        switch($rule) {
        // 四捨五入
        case 1:
            $ret = round($ret);
            break;
        // 切り捨て
        case 2:
            $ret = floor($ret);
            break;
        // 切り上げ
        case 3:
            $ret = ceil($ret);
            break;
        // デフォルト:切り上げ
        default:
            $ret = ceil($ret);
            break;
        }
        //キャンペーン商品の場合
        if(isset($campaign_point_rate) && $campaign_point_rate != "") {
            $ret = "(".$arrRet[0]['campaign_name']."ポイント率".$campaign_point_rate."%)".$ret;
        }
        return $ret;
    }

    /* 規格分類の件数取得 */
    function sfGetClassCatCount() {
        $sql = "select count(dtb_class.class_id) as count, dtb_class.class_id ";
        $sql.= "from dtb_class inner join dtb_classcategory on dtb_class.class_id = dtb_classcategory.class_id ";
        $sql.= "where dtb_class.del_flg = 0 AND dtb_classcategory.del_flg = 0 ";
        $sql.= "group by dtb_class.class_id, dtb_class.name";
        $objQuery = new SC_Query();
        $arrList = $objQuery->getall($sql);
        // キーと値をセットした配列を取得
        $arrRet = SC_Utils::sfArrKeyValue($arrList, 'class_id', 'count');

        return $arrRet;
    }

    /* 規格の登録 */
    function sfInsertProductClass($objQuery, $arrList, $product_id) {
        // すでに規格登録があるかどうかをチェックする。
        $where = "product_id = ? AND classcategory_id1 <> 0 AND classcategory_id1 <> 0";
        $count = $objQuery->count("dtb_products_class", $where,  array($product_id));

        // すでに規格登録がない場合
        if($count == 0) {
            // 既存規格の削除
            $where = "product_id = ?";
            $objQuery->delete("dtb_products_class", $where, array($product_id));

            // 配列の添字を定義
            $checkArray = array("product_code", "stock", "stock_unlimited", "price01", "price02");
            $arrList = SC_Utils_Ex::arrayDefineIndexes($arrList, $checkArray);

            $sqlval['product_id'] = $product_id;
            $sqlval['classcategory_id1'] = '0';
            $sqlval['classcategory_id2'] = '0';
            $sqlval['product_code'] = $arrList["product_code"];
            $sqlval['stock'] = $arrList["stock"];
            $sqlval['stock_unlimited'] = $arrList["stock_unlimited"];
            $sqlval['price01'] = $arrList['price01'];
            $sqlval['price02'] = $arrList['price02'];
            $sqlval['creator_id'] = $_SESSION['member_id'];
            $sqlval['create_date'] = "now()";

            if($_SESSION['member_id'] == "") {
                $sqlval['creator_id'] = '0';
            }

            // INSERTの実行
            $objQuery->insert("dtb_products_class", $sqlval);
        }
    }

    function sfGetProductClassId($product_id, $classcategory_id1, $classcategory_id2) {
        $where = "product_id = ? AND classcategory_id1 = ? AND classcategory_id2 = ?";
        $objQuery = new SC_Query();
        $ret = $objQuery->get("dtb_products_class", "product_class_id", $where, Array($product_id, $classcategory_id1, $classcategory_id2));
        return $ret;
    }

    /* 文末の「/」をなくす */
    function sfTrimURL($url) {
        $ret = ereg_replace("[/]+$", "", $url);
        return $ret;
    }

    /* DBから取り出した日付の文字列を調整する。*/
    function sfDispDBDate($dbdate, $time = true) {
        list($y, $m, $d, $H, $M) = split("[- :]", $dbdate);

        if(strlen($y) > 0 && strlen($m) > 0 && strlen($d) > 0) {
            if ($time) {
                $str = sprintf("%04d/%02d/%02d %02d:%02d", $y, $m, $d, $H, $M);
            } else {
                $str = sprintf("%04d/%02d/%02d", $y, $m, $d, $H, $M);
            }
        } else {
            $str = "";
        }
        return $str;
    }

    /* 配列をキー名ごとの配列に変更する */
    function sfSwapArray($array, $isColumnName = true) {
        $arrRet = array();
        $max = count($array);
        for($i = 0; $i < $max; $i++) {
            $j = 0;
            foreach($array[$i] as $key => $val) {
                if ($isColumnName) {
                    $arrRet[$key][] = $val;
                } else {
                    $arrRet[$j][] = $val;
                }
                $j++;
            }
        }
        return $arrRet;
    }

    /**
     * 連想配列から新たな配列を生成して返す.
     *
     * $requires が指定された場合, $requires に含まれるキーの値のみを返す.
     *
     * @param array 連想配列
     * @param array 必須キーの配列
     * @return array 連想配列の値のみの配列
     */
    function getHash2Array($hash, $requires = array()) {
        $array = array();
        $i = 0;
        foreach ($hash as $key => $val) {
            if (!empty($requires)) {
                if (in_array($key, $requires)) {
                    $array[$i] = $val;
                    $i++;
                }
            } else {
                $array[$i] = $val;
                $i++;
            }
        }
        return $array;
    }

    /* かけ算をする（Smarty用) */
    function sfMultiply($num1, $num2) {
        return ($num1 * $num2);
    }

    // カードの処理結果を返す
    function sfGetAuthonlyResult($dir, $file_name, $name01, $name02, $card_no, $card_exp, $amount, $order_id, $jpo_info = "10"){

        $path = $dir .$file_name;		// cgiファイルのフルパス生成
        $now_dir = getcwd();			// requireがうまくいかないので、cgi実行ディレクトリに移動する
        chdir($dir);

        // パイプ渡しでコマンドラインからcgi起動
        $cmd = "$path card_no=$card_no name01=$name01 name02=$name02 card_exp=$card_exp amount=$amount order_id=$order_id jpo_info=$jpo_info";

        $tmpResult = popen($cmd, "r");

        // 結果取得
        while( ! FEOF ( $tmpResult ) ) {
            $result .= FGETS($tmpResult);
        }
        pclose($tmpResult);				// 	パイプを閉じる
        chdir($now_dir);				//　元にいたディレクトリに帰る

        // 結果を連想配列へ格納
        $result = ereg_replace("&$", "", $result);
        foreach (explode("&",$result) as $data) {
            list($key, $val) = explode("=", $data, 2);
            $return[$key] = $val;
        }

        return $return;
    }

    /* 加算ポイントの計算式 */
    function sfGetAddPoint($totalpoint, $use_point, $arrInfo) {
        // 購入商品の合計ポイントから利用したポイントのポイント換算価値を引く方式
        $add_point = $totalpoint - intval($use_point * ($arrInfo['point_rate'] / 100));

        if($add_point < 0) {
            $add_point = '0';
        }
        return $add_point;
    }

    /* 一意かつ予測されにくいID */
    function sfGetUniqRandomId($head = "") {
        // 予測されないようにランダム文字列を付与する。
        $random = GC_Utils_Ex::gfMakePassword(8);
        // 同一ホスト内で一意なIDを生成
        $id = uniqid($head);
        return ($id . $random);
    }

    // カテゴリ別オススメ品の取得
    function sfGetBestProducts( $conn, $category_id = 0){
        // 既に登録されている内容を取得する
        $sql = "SELECT name, main_image, main_list_image, price01_min, price01_max, price02_min, price02_max, point_rate,
                 A.product_id, A.comment FROM dtb_best_products as A LEFT JOIN vw_products_allclass AS allcls
                USING (product_id) WHERE A.category_id = ? AND A.del_flg = 0 AND status = 1 ORDER BY A.rank";
        $arrItems = $conn->getAll($sql, array($category_id));

        return $arrItems;
    }

    // 特殊制御文字の手動エスケープ
    function sfManualEscape($data) {
        // 配列でない場合
        if(!is_array($data)) {
            if (DB_TYPE == "pgsql") {
                $ret = pg_escape_string($data);
            }else if(DB_TYPE == "mysql"){
                $ret = mysql_real_escape_string($data);
            }
            $ret = ereg_replace("%", "\\%", $ret);
            $ret = ereg_replace("_", "\\_", $ret);
            return $ret;
        }

        // 配列の場合
        foreach($data as $val) {
            if (DB_TYPE == "pgsql") {
                $ret = pg_escape_string($val);
            }else if(DB_TYPE == "mysql"){
                $ret = mysql_real_escape_string($val);
            }

            $ret = ereg_replace("%", "\\%", $ret);
            $ret = ereg_replace("_", "\\_", $ret);
            $arrRet[] = $ret;
        }

        return $arrRet;
    }

    /* ドメイン間で有効なセッションのスタート */
    function sfDomainSessionStart() {
        $ret = session_id();
    /*
        ヘッダーを送信していてもsession_start()が必要なページがあるので
        コメントアウトしておく
        if($ret == "" && !headers_sent()) {
    */
        if($ret == "") {
            /* セッションパラメータの指定
             ・ブラウザを閉じるまで有効
             ・すべてのパスで有効
             ・同じドメイン間で共有 */
            session_set_cookie_params (0, "/", DOMAIN_NAME);

            if(!ini_get("session.auto_start")){
                // セッション開始
                session_start();
            }
        }
    }

    /* 文字列に強制的に改行を入れる */
    function sfPutBR($str, $size) {
        $i = 0;
        $cnt = 0;
        $line = array();
        $ret = "";

        while($str[$i] != "") {
            $line[$cnt].=$str[$i];
            $i++;
            if(strlen($line[$cnt]) > $size) {
                $line[$cnt].="<br />";
                $cnt++;
            }
        }

        foreach($line as $val) {
            $ret.=$val;
        }
        return $ret;
    }

    // 二回以上繰り返されているスラッシュ[/]を一つに変換する。
    function sfRmDupSlash($istr){
        if(ereg("^http://", $istr)) {
            $str = substr($istr, 7);
            $head = "http://";
        } else if(ereg("^https://", $istr)) {
            $str = substr($istr, 8);
            $head = "https://";
        } else {
            $str = $istr;
        }
        $str = ereg_replace("[/]+", "/", $str);
        $ret = $head . $str;
        return $ret;
    }

    function sfEncodeFile($filepath, $enc_type, $out_dir) {
        $ifp = fopen($filepath, "r");

        $basename = basename($filepath);
        $outpath = $out_dir . "enc_" . $basename;

        $ofp = fopen($outpath, "w+");

        while(!feof($ifp)) {
            $line = fgets($ifp);
            $line = mb_convert_encoding($line, $enc_type, "auto");
            fwrite($ofp,  $line);
        }

        fclose($ofp);
        fclose($ifp);

        return 	$outpath;
    }

    function sfCutString($str, $len, $byte = true, $commadisp = true) {
        if($byte) {
            if(strlen($str) > ($len + 2)) {
                $ret =substr($str, 0, $len);
                $cut = substr($str, $len);
            } else {
                $ret = $str;
                $commadisp = false;
            }
        } else {
            if(mb_strlen($str) > ($len + 1)) {
                $ret = mb_substr($str, 0, $len);
                $cut = mb_substr($str, $len);
            } else {
                $ret = $str;
                $commadisp = false;
            }
        }

        // 絵文字タグの途中で分断されないようにする。
        if (isset($cut)) {
            // 分割位置より前の最後の [ 以降を取得する。
            $head = strrchr($ret, '[');

            // 分割位置より後の最初の ] 以前を取得する。
            $tail_pos = strpos($cut, ']');
            if ($tail_pos !== false) {
                $tail = substr($cut, 0, $tail_pos + 1);
            }

            // 分割位置より前に [、後に ] が見つかった場合は、[ から ] までを
            // 接続して絵文字タグ1個分になるかどうかをチェックする。
            if ($head !== false && $tail_pos !== false) {
                $subject = $head . $tail;
                if (preg_match('/^\[emoji:e?\d+\]$/', $subject)) {
                    // 絵文字タグが見つかったので削除する。
                    $ret = substr($ret, 0, -strlen($head));
                }
            }
        }

        if($commadisp){
            $ret = $ret . "...";
        }
        return $ret;
    }

    // 年、月、締め日から、先月の締め日+1、今月の締め日を求める。
    function sfTermMonth($year, $month, $close_day) {
        $end_year = $year;
        $end_month = $month;

        // 開始月が終了月と同じか否か
        $same_month = false;

        // 該当月の末日を求める。
        $end_last_day = date("d", mktime(0, 0, 0, $month + 1, 0, $year));

        // 月の末日が締め日より少ない場合
        if($end_last_day < $close_day) {
            // 締め日を月末日に合わせる
            $end_day = $end_last_day;
        } else {
            $end_day = $close_day;
        }

        // 前月の取得
        $tmp_year = date("Y", mktime(0, 0, 0, $month, 0, $year));
        $tmp_month = date("m", mktime(0, 0, 0, $month, 0, $year));
        // 前月の末日を求める。
        $start_last_day = date("d", mktime(0, 0, 0, $month, 0, $year));

        // 前月の末日が締め日より少ない場合
        if ($start_last_day < $close_day) {
            // 月末日に合わせる
            $tmp_day = $start_last_day;
        } else {
            $tmp_day = $close_day;
        }

        // 先月の末日の翌日を取得する
        $start_year = date("Y", mktime(0, 0, 0, $tmp_month, $tmp_day + 1, $tmp_year));
        $start_month = date("m", mktime(0, 0, 0, $tmp_month, $tmp_day + 1, $tmp_year));
        $start_day = date("d", mktime(0, 0, 0, $tmp_month, $tmp_day + 1, $tmp_year));

        // 日付の作成
        $start_date = sprintf("%d/%d/%d 00:00:00", $start_year, $start_month, $start_day);
        $end_date = sprintf("%d/%d/%d 23:59:59", $end_year, $end_month, $end_day);

        return array($start_date, $end_date);
    }

    // PDF用のRGBカラーを返す
    function sfGetPdfRgb($hexrgb) {
        $hex = substr($hexrgb, 0, 2);
        $r = hexdec($hex) / 255;

        $hex = substr($hexrgb, 2, 2);
        $g = hexdec($hex) / 255;

        $hex = substr($hexrgb, 4, 2);
        $b = hexdec($hex) / 255;

        return array($r, $g, $b);
    }

    //メルマガ仮登録とメール配信
    function sfRegistTmpMailData($mail_flag, $email){
        $objQuery = new SC_Query();
        $objConn = new SC_DBConn();
        $objPage = new LC_Page();

        $random_id = sfGetUniqRandomId();
        $arrRegistMailMagazine["mail_flag"] = $mail_flag;
        $arrRegistMailMagazine["email"] = $email;
        $arrRegistMailMagazine["temp_id"] =$random_id;
        $arrRegistMailMagazine["end_flag"]='0';
        $arrRegistMailMagazine["update_date"] = 'now()';

        //メルマガ仮登録用フラグ
        $flag = $objQuery->count("dtb_customer_mail_temp", "email=?", array($email));
        $objConn->query("BEGIN");
        switch ($flag){
            case '0':
            $objConn->autoExecute("dtb_customer_mail_temp",$arrRegistMailMagazine);
            break;

            case '1':
            $objConn->autoExecute("dtb_customer_mail_temp",$arrRegistMailMagazine, "email = '" .addslashes($email). "'");
            break;
        }
        $objConn->query("COMMIT");
        $subject = sfMakeSubject('メルマガ仮登録が完了しました。');
        $objPage->tpl_url = SSL_URL."mailmagazine/regist.php?temp_id=".$arrRegistMailMagazine['temp_id'];
        switch ($mail_flag){
            case '1':
            $objPage->tpl_name = "登録";
            $objPage->tpl_kindname = "HTML";
            break;

            case '2':
            $objPage->tpl_name = "登録";
            $objPage->tpl_kindname = "テキスト";
            break;

            case '3':
            $objPage->tpl_name = "解除";
            break;
        }
            $objPage->tpl_email = $email;
        sfSendTplMail($email, $subject, 'mail_templates/mailmagazine_temp.tpl', $objPage);
    }

    // 再帰的に多段配列を検索して一次元配列(Hidden引渡し用配列)に変換する。
    function sfMakeHiddenArray($arrSrc, $arrDst = array(), $parent_key = "") {
        if(is_array($arrSrc)) {
            foreach($arrSrc as $key => $val) {
                if($parent_key != "") {
                    $keyname = $parent_key . "[". $key . "]";
                } else {
                    $keyname = $key;
                }
                if(is_array($val)) {
                    $arrDst = SC_Utils::sfMakeHiddenArray($val, $arrDst, $keyname);
                } else {
                    $arrDst[$keyname] = $val;
                }
            }
        }
        return $arrDst;
    }

    // DB取得日時をタイムに変換
    function sfDBDatetoTime($db_date) {
        $date = ereg_replace("\..*$","",$db_date);
        $time = strtotime($date);
        return $time;
    }

    // 出力の際にテンプレートを切り替えられる
    /*
        index.php?tpl=test.tpl
    */
    function sfCustomDisplay($objPage, $is_mobile = false) {
        $basename = basename($_SERVER["REQUEST_URI"]);

        if($basename == "") {
            $path = $_SERVER["REQUEST_URI"] . "index.php";
        } else {
            $path = $_SERVER["REQUEST_URI"];
        }

        if(isset($_GET['tpl']) && $_GET['tpl'] != "") {
            $tpl_name = $_GET['tpl'];
        } else {
            $tpl_name = ereg_replace("^/", "", $path);
            $tpl_name = ereg_replace("/", "_", $tpl_name);
            $tpl_name = ereg_replace("(\.php$|\.html$)", ".tpl", $tpl_name);
        }

        $template_path = TEMPLATE_FTP_DIR . $tpl_name;

        if($is_mobile === true) {
            $objView = new SC_MobileView();
            $objView->assignobj($objPage);
            $objView->display(SITE_FRAME);
        } else if(file_exists($template_path)) {
            $objView = new SC_UserView(TEMPLATE_FTP_DIR, COMPILE_FTP_DIR);
            $objView->assignobj($objPage);
            $objView->display($tpl_name);
        } else {
            $objView = new SC_SiteView();
            $objView->assignobj($objPage);
            $objView->display(SITE_FRAME);
        }
    }

    // PHPのmb_convert_encoding関数をSmartyでも使えるようにする
    function sf_mb_convert_encoding($str, $encode = 'CHAR_CODE') {
        return  mb_convert_encoding($str, $encode);
    }

    // PHPのmktime関数をSmartyでも使えるようにする
    function sf_mktime($format, $hour=0, $minute=0, $second=0, $month=1, $day=1, $year=1999) {
        return  date($format,mktime($hour, $minute, $second, $month, $day, $year));
    }

    // PHPのdate関数をSmartyでも使えるようにする
    function sf_date($format, $timestamp = '') {
        return  date( $format, $timestamp);
    }

    // チェックボックスの型を変換する
    function sfChangeCheckBox($data , $tpl = false){
        if ($tpl) {
            if ($data == 1){
                return 'checked';
            }else{
                return "";
            }
        }else{
            if ($data == "on"){
                return 1;
            }else{
                return 2;
            }
        }
    }

    // 2つの配列を用いて連想配列を作成する
    function sfarrCombine($arrKeys, $arrValues) {

        if(count($arrKeys) <= 0 and count($arrValues) <= 0) return array();

        $keys = array_values($arrKeys);
        $vals = array_values($arrValues);

        $max = max( count( $keys ), count( $vals ) );
        $combine_ary = array();
        for($i=0; $i<$max; $i++) {
            $combine_ary[$keys[$i]] = $vals[$i];
        }
        if(is_array($combine_ary)) return $combine_ary;

        return false;
    }

    /* 子ID所属する親IDを取得する */
    function sfGetParentsArraySub($arrData, $pid_name, $id_name, $child) {
        $max = count($arrData);
        $parent = "";
        for($i = 0; $i < $max; $i++) {
            if($arrData[$i][$id_name] == $child) {
                $parent = $arrData[$i][$pid_name];
                break;
            }
        }
        return $parent;
    }

    /* 階層構造のテーブルから与えられたIDの兄弟を取得する */
    function sfGetBrothersArray($arrData, $pid_name, $id_name, $arrPID) {
        $max = count($arrData);

        $arrBrothers = array();
        foreach($arrPID as $id) {
            // 親IDを検索する
            for($i = 0; $i < $max; $i++) {
                if($arrData[$i][$id_name] == $id) {
                    $parent = $arrData[$i][$pid_name];
                    break;
                }
            }
            // 兄弟IDを検索する
            for($i = 0; $i < $max; $i++) {
                if($arrData[$i][$pid_name] == $parent) {
                    $arrBrothers[] = $arrData[$i][$id_name];
                }
            }
        }
        return $arrBrothers;
    }

    /* 階層構造のテーブルから与えられたIDの直属の子を取得する */
    function sfGetUnderChildrenArray($arrData, $pid_name, $id_name, $parent) {
        $max = count($arrData);

        $arrChildren = array();
        // 子IDを検索する
        for($i = 0; $i < $max; $i++) {
            if($arrData[$i][$pid_name] == $parent) {
                $arrChildren[] = $arrData[$i][$id_name];
            }
        }
        return $arrChildren;
    }

    // SQLシングルクォート対応
    function sfQuoteSmart($in){

        if (is_int($in) || is_double($in)) {
            return $in;
        } elseif (is_bool($in)) {
            return $in ? 1 : 0;
        } elseif (is_null($in)) {
            return 'NULL';
        } else {
            return "'" . str_replace("'", "''", $in) . "'";
        }
    }

    // ディレクトリ以下のファイルを再帰的にコピー
    function sfCopyDir($src, $des, $mess, $override = false){
        if(!is_dir($src)){
            return false;
        }

        $oldmask = umask(0);
        $mod= stat($src);

        // ディレクトリがなければ作成する
        if(!file_exists($des)) {
            if(!mkdir($des, $mod[2])) {
                print("path:" . $des);
            }
        }

        $fileArray=glob( $src."*" );
        foreach( $fileArray as $key => $data_ ){
            // CVS管理ファイルはコピーしない
            if(ereg("/CVS/Entries", $data_)) {
                break;
            }
            if(ereg("/CVS/Repository", $data_)) {
                break;
            }
            if(ereg("/CVS/Root", $data_)) {
                break;
            }

            mb_ereg("^(.*[\/])(.*)",$data_, $matches);
            $data=$matches[2];
            if( is_dir( $data_ ) ){
                $mess = sfCopyDir( $data_.'/', $des.$data.'/', $mess);
            }else{
                if(!$override && file_exists($des.$data)) {
                    $mess.= $des.$data . "：ファイルが存在します\n";
                } else {
                    if(@copy( $data_, $des.$data)) {
                        $mess.= $des.$data . "：コピー成功\n";
                    } else {
                        $mess.= $des.$data . "：コピー失敗\n";
                    }
                }
                $mod=stat($data_ );
            }
        }
        umask($oldmask);
        return $mess;
    }

    // 指定したフォルダ内のファイルを全て削除する
    function sfDelFile($dir){
        $dh = opendir($dir);
        // フォルダ内のファイルを削除
        while($file = readdir($dh)){
            if ($file == "." or $file == "..") continue;
            $del_file = $dir . "/" . $file;
            if(is_file($del_file)){
                $ret = unlink($dir . "/" . $file);
            }else if (is_dir($del_file)){
                $ret = sfDelFile($del_file);
            }

            if(!$ret){
                return $ret;
            }
        }

        // 閉じる
        closedir($dh);

        // フォルダを削除
        return rmdir($dir);
    }

    /*
     * 関数名：sfWriteFile
     * 引数1 ：書き込むデータ
     * 引数2 ：ファイルパス
     * 引数3 ：書き込みタイプ
     * 引数4 ：パーミッション
     * 戻り値：結果フラグ 成功なら true 失敗なら false
     * 説明　：ファイル書き出し
     */
    function sfWriteFile($str, $path, $type, $permission = "") {
        //ファイルを開く
        if (!($file = fopen ($path, $type))) {
            return false;
        }

        //ファイルロック
        flock ($file, LOCK_EX);
        //ファイルの書き込み
        fputs ($file, $str);
        //ファイルロックの解除
        flock ($file, LOCK_UN);
        //ファイルを閉じる
        fclose ($file);
        // 権限を指定
        if($permission != "") {
            chmod($path, $permission);
        }

        return true;
    }

    function sfFlush($output = " ", $sleep = 0){
        // 実行時間を制限しない
        set_time_limit(0);
        // 出力をバッファリングしない(==日本語自動変換もしない)
        ob_end_clean();

        // IEのために256バイト空文字出力
        echo str_pad('',256);

        // 出力はブランクだけでもいいと思う
        echo $output;
        // 出力をフラッシュする
        flush();

        ob_end_flush();
        ob_start();

        // 時間のかかる処理
        sleep($sleep);
    }

    // @versionの記載があるファイルからバージョンを取得する。
    function sfGetFileVersion($path) {
        if(file_exists($path)) {
            $src_fp = fopen($path, "rb");
            if($src_fp) {
                while (!feof($src_fp)) {
                    $line = fgets($src_fp);
                    if(ereg("@version", $line)) {
                        $arrLine = split(" ", $line);
                        $version = $arrLine[5];
                    }
                }
                fclose($src_fp);
            }
        }
        return $version;
    }

    // 指定したURLに対してPOSTでデータを送信する
    function sfSendPostData($url, $arrData, $arrOkCode = array()){
        require_once(DATA_PATH . "module/Request.php");

        // 送信インスタンス生成
        $req = new HTTP_Request($url);

        $req->addHeader('User-Agent', 'DoCoMo/2.0　P2101V(c100)');
        $req->setMethod(HTTP_REQUEST_METHOD_POST);

        // POSTデータ送信
        $req->addPostDataArray($arrData);

        // エラーが無ければ、応答情報を取得する
        if (!PEAR::isError($req->sendRequest())) {

            // レスポンスコードがエラー判定なら、空を返す
            $res_code = $req->getResponseCode();

            if(!in_array($res_code, $arrOkCode)){
                $response = "";
            }else{
                $response = $req->getResponseBody();
            }

        } else {
            $response = "";
        }

        // POSTデータクリア
        $req->clearPostData();

        return $response;
    }

    /**
     * $array の要素を $arrConvList で指定した方式で mb_convert_kana を適用する.
     *
     * @param array $array 変換する文字列の配列
     * @param array $arrConvList mb_convert_kana の適用ルール
     * @return array 変換後の配列
     * @see mb_convert_kana
     */
    function mbConvertKanaWithArray($array, $arrConvList) {
        foreach ($arrConvList as $key => $val) {
            if(isset($array[$key])) {
                $array[$key] = mb_convert_kana($array[$key] ,$val);
            }
        }
        return $array;
    }

    /**
     * 配列の添字が未定義の場合は空文字を代入して定義する.
     *
     * @param array $array 添字をチェックする配列
     * @param array $defineIndexes チェックする添字
     * @return array 添字を定義した配列
     */
    function arrayDefineIndexes($array, $defineIndexes) {
        foreach ($defineIndexes as $key) {
            if (!isset($array[$key])) $array[$key] = "";
        }
        return $array;
    }

    /**
     * XML宣言を出力する.
     *
     * XML宣言があると問題が発生する UA は出力しない.
     *
     * @return string XML宣言の文字列
     */
    function printXMLDeclaration() {
        $ua = $_SERVER['HTTP_USER_AGENT'];
        if (!preg_match("/MSIE/", $ua) || preg_match("/MSIE 7/", $ua)) {
            print("<?xml version='1.0' encoding='" . CHAR_CODE . "'?>\n");
        }
    }

    /* デバッグ用 ------------------------------------------------------------------------------------------------*/
    function sfPrintR($obj) {
        print("<div style='font-size: 12px;color: #00FF00;'>\n");
        print("<strong>**デバッグ中**</strong><br />\n");
        print("<pre>\n");
        //print_r($obj);
        var_dump($obj);
        print("</pre>\n");
        print("<strong>**デバッグ中**</strong></div>\n");
    }
}
?>
