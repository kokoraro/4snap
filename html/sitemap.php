<?php
/**
 *
 * Copyright(c) 2000-2007 LOCKON CO.,LTD. All Rights Reserved.
 *
 * http://www.lockon.co.jp/
 *
 */

/**
 * Sitemap�ץ�ȥ��� �ե����������⥸�塼��.
 * PHP versions 4 and 5
 *
 * <pre>
 * ���Υ⥸�塼��� Sitemap�ץ�ȥ�����б����� XML�ե��������Ϥ���.
 * EC-CUBE ���󥹥ȡ���ǥ��쥯�ȥ�� html�ǥ��쥯�ȥ�����֤��뤳�Ȥˤ��ư���.
 *
 * ���Υ⥸�塼��ˤ��, �ʲ��Υڡ����Υ����ȥޥåפ����������.
 * 1. $staticURL �ǻ��ꤷ���ڡ���
 * 2. �������̤Υǥ���������������������ڡ���
 * 3. ��������Ƥ��뤹�٤Ƥξ��ʰ����ڡ���
 * 4. ��������Ƥ��뤹�٤Ƥξ��ʾܺ٥ڡ���
 * 5. html/mobile �ʲ��ξ嵭�ڡ���
 *
 * ���Υ⥸�塼������ָ�, �Ƹ������󥸥�˥����ȥޥåפ���Ͽ���뤳�Ȥˤ��, �������󥸥��
 * ����ǥå�������¥�ʤ����.
 * </pre>
 * @see https://www.google.com/webmasters/tools/siteoverview?hl=ja
 * @see https://siteexplorer.search.yahoo.com/mysites
 *
 * @author Kentaro Ohkouchi
 * @version $Id$
 *
 */
require_once("require.php");
// --------------------------------------------------------------------- �������
// :TODO: filemtime �ؿ���Ȥ��С���Ū�ʥڡ����ι������֤��������褦�ˤǤ�����
//
// ưŪ����������ʤ��ڡ���������ǻ���
$staticURL = array(SITE_URL, MOBILE_SITE_URL, SITE_URL . "rss/index.php");
// :TODO: �ƥڡ����� changefreq �� priority �����Ǥ���褦�ˤ���
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// }}}
// {{{ View Logic

/**
 * Sitemap �� <url /> ����������.
 *
 * @param string $loc �ڡ����� URL ��ɬ��
 * @param string $lastmod �ե�����κǽ������� YYYY-MM-DD or  W3C Datetime ����
 * @param string $changefreq �ڡ����ι�������
 * @param double $priority URL ��ͥ����
 * @return Sitemap ������ <url />
 * @see https://www.google.com/webmasters/tools/docs/ja/protocol.html#xmlTagDefinitions
 */
function createSitemap($loc, $lastmod = "", $changefreq = "", $priority = "") {
    printf("\t<url>\n");
    printf("\t\t<loc>%s</loc>\n", htmlentities($loc, ENT_QUOTES, "UTF-8"));
    if (!empty($lastmod)) {
        printf("\t\t<lastmod>%s</lastmod>\n", $lastmod);
    }
    if (!empty($changefreq)) {
        printf("\t\t<changefreq>%s</changefreq>\n", $changefreq);
    }
    if(!empty($priority)) {
        printf("\t\t<priority>%01.1f</priority>\n", $priority);
    }
    printf("\t</url>\n");
}

$objQuery = new SC_Query();

//����å��夷�ʤ�(ǰ�Τ���)
header("Paragrama: no-cache");

//XML�ƥ�����
header("Content-type: application/xml; charset=utf-8");

// ɬ�� UTF-8 �Ȥ��ƽ���
mb_http_output("UTF-8");
ob_start('mb_output_handler');

print("<?xml version='1.0' encoding='UTF-8'?>\n");
print("<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>\n");

// ----------------------------------------------------------------------------
// }}}
// {{{ Controller Logic

// ��Ū�ʥڡ��������
foreach($staticURL as $url) {
    createSitemap($url, '', 'daily', 1.0);
}
// �ڡ����Υǡ��������
$objPageData = new LC_PageLayout;

// TOP�ڡ��������
$topPage = getTopPage($objPageData->arrPageList);
createSitemap($topPage[0]['url'], date2W3CDatetime($topPage[0]['update_date']),
                'daily', 1.0);

// �Խ���ǽ�ڡ��������
$editablePages = getEditablePage($objPageData->arrPageList);
foreach($editablePages as $editablePage) {
    createSitemap($editablePage['url'], date2W3CDatetime($editablePage['update_date']));
}

// ���ʰ����ڡ��������
$products = getAllProducts();
foreach($products as $product) {
    createSitemap($product['url'], '', 'daily');
}
$mobileProducts = getAllProducts(true);
foreach($mobileProducts as $mobileProduct) {
    createSitemap($mobileProduct['url'], '', 'daily');
}

// ���ʾܺ٥ڡ��������
$details = getAllDetail();
foreach($details as $detail) {
    createSitemap($detail['url'], date2W3CDatetime($detail['update_date']));
}
$mobileDetails = getAllDetail(true);
foreach($mobileDetails as $mobileDetail) {
    createSitemap($mobileDetail['url'], date2W3CDatetime($mobileDetail['update_date']));
}

print("</urlset>\n");

// ----------------------------------------------------------------------------
// }}}
// {{{ Model Logic

/**
 * TOP�ڡ����ξ�������
 *
 * @param array $pageData ���٤ƤΥڡ������������
 * @return TOP�ڡ����ξ���
 */
function getTopPage($pageData) {
    $arrRet = array();
    foreach($pageData as $page) {
        if ($page['page_id'] == "1") {
            $page['url'] = SITE_URL . $page['url'];
            $arrRet[0] = $page;
            return $arrRet;
        }
    }
}

/**
 * ���٤Ƥ��Խ���ǽ�ڡ����ξ�����������.
 *
 * @param array $pageData ���٤ƤΥڡ������������
 * @return �Խ���ǽ�ڡ���
 */
function getEditablePage($pageData) {
    $arrRet = array();
    $i = 0;
    foreach($pageData as $page) {
        if ($page['page_id'] > 4) {
            $arrRet[$i] = $page;
            $i++;
        }
    }
    return $arrRet;
}

/**
 * date������ʸ����� W3C Datetime �������Ѵ����ƽ��Ϥ���.
 *
 * @param date $date �Ѵ���������
 */
function date2W3CDatetime($date) {
    $arr = array();
    // ����ɽ����ʸ��������
    ereg("^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})",
        $date, $arr);
    // :TODO: time zone ���������٤�...
    return sprintf("%04d-%02d-%02dT%02d:%02d:%02d+09:00",
            $arr[1], $arr[2], $arr[3], $arr[4], $arr[5], $arr[6]);
}

// ----------------------------------------------------------------------------
// }}}
// {{{ DB Access Objects

/**
 * �ڡ����ǡ����򰷤����饹.
 */
class LC_PageLayout {

    var $arrPageData;		// �ڡ����ǡ�����Ǽ��
    var $arrPageList;		// �ڡ����ǡ�����Ǽ��

    /**
     * ���󥹥ȥ饯��.
     */
    function LC_PageLayout() {
        $this->arrPageList = $this->getPageData();
    }

    /**
     * �֥�å�������������.
     *
     * @param string $where WHERE��
     * @param array  $arrVal WHERE����ͤ��Ǽ��������
     * @return �֥�å�����
     */
    function getPageData($where = '', $arrVal = ''){
        $objDBConn = new SC_DbConn;		// DB���֥�������
        $sql = "";						// �ǡ�������SQL������
        $arrRet = array();				// �ǡ���������

        // SQL����(url �� update_date �ʳ������ס�)
        $sql .= " SELECT";
        $sql .= " page_id";				// �ڡ���ID
        $sql .= " ,page_name";			// ̾��
        $sql .= " ,url";				// URL
        $sql .= " ,php_dir";			// php��¸��ǥ��쥯�ȥ�
        $sql .= " ,tpl_dir";			// tpl��¸��ǥ�d�쥯�ȥ�
        $sql .= " ,filename";			// �ե�����̾��
        $sql .= " ,header_chk ";		// �إå�������FLG
        $sql .= " ,footer_chk ";		// �եå�������FLG
        $sql .= " ,author";				// author����
        $sql .= " ,description";		// description����
        $sql .= " ,keyword";			// keyword����
        $sql .= " ,update_url";			// ����URL
        $sql .= " ,create_date";		// �ǡ���������
        $sql .= " ,update_date";		// �ǡ���������
        $sql .= " FROM ";
        $sql .= "     dtb_pagelayout";

        // where��λ��꤬������ɲ�
        if ($where != '') {
            $sql .= " WHERE " . $where;
        }

        $sql .= " ORDER BY 	page_id";

        $arrRet = $objDBConn->getAll($sql, $arrVal);

        $this->arrPageData = $arrRet;

        return $arrRet;
    }
}

/**
 * ���٤Ƥξ��ʰ����ڡ������������.
 *
 * @param boolean $isMobile ��Х���ڡ�������������� true
 * @return �������󥸥󤫤饢��������ǽ�ʾ��ʰ����ڡ����ξ���
 */
function getAllProducts($isMobile = false) {
    $conn = new SC_DBConn();
    $sql = "SELECT category_id FROM dtb_category WHERE del_flg = 0";
    $result = $conn->getAll($sql);

    $mobile = "";
    if ($isMobile) {
        $mobile = "mobile/";
    }

    $arrRet = array();
    for ($i = 0; $i < count($result); $i++) {
        // :TODO: ���ƥ���κǽ�������������Ǥ���褦�ˤ���
        $page = array("url" => SITE_URL . sprintf("%sproducts/list.php?category_id=%d", $mobile, $result[$i]['category_id']));
        $arrRet[$i] = $page;
    }
    return $arrRet;
}

/**
 * ���٤Ƥξ��ʾܺ٥ڡ������������.
 *
 * @param boolean $isMobile ��Х���ڡ�������������� true
 * @return �������󥸥󤫤饢��������ǽ�ʾ��ʾܺ٥ڡ����ξ���
 */
function getAllDetail($isMobile = false) {
    $conn = new SC_DBConn();
    $sql = "SELECT product_id, update_date FROM dtb_products WHERE del_flg = 0 AND status = 1";
    $result = $conn->getAll($sql);

    $mobile = "";
    if ($isMobile) {
        $mobile = "mobile/";
    }

    $arrRet = array();
    for ($i = 0; $i < count($result); $i++) {
        $page = array("url" => SITE_URL. sprintf("%sproducts/detail.php?product_id=%d", $mobile, $result[$i]['product_id']),
                        "update_date" => $result[$i]['update_date']);
        $arrRet[$i] = $page;
    }
    return $arrRet;
}
?>
