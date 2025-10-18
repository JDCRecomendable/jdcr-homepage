#!/usr/bin/env python3

# -*- coding: utf-8 -*-

# Copyright (c) 2021-2025 Jared Recomendable.

import sys

def extract_bookmarks(bookmark_filepath):
    '''
    Extract bookmarks from bookmark file exported
    from Chromium.  Bookmarks are returned in the form
    of a dictionary, in a key-value pair of title-href
    '''
    bookmarks = {}
    bookmark_file = open(bookmark_filepath, 'r')
    for line in bookmark_file.readlines():
        if '<A HREF="' in line and '" ADD_DATE="' in line:
            href = line.split('HREF="')[1].split('" ADD_DATE="')[0]
            title = line.split('>')[-2].split('</A')[0].replace('&#39;', "'")
            bookmarks[title] = href
        if '<H3 ADD_DATE="' in line:
            category = line.split('>')[-2].split('</H3')[0]
            bookmarks[category] = -1
    bookmark_file.close()
    return bookmarks

def format_to_html(bookmarks):
    '''
    Put bookmarks into HTML-formatted Python string.
    Expects bookmarks in the form of a dictionary, in a key-
    value pair of title-href.
    '''
    html = ''
    for title in bookmarks:
        if bookmarks[title] != -1:
            html += '<li><a href="'
            html += bookmarks[title]
            html += '">'
            html += title
            html += '</a></li>\n'
        else:
            html += '\n{}\n'.format(title)
    return html

if __name__ == "__main__":
    if len(sys.argv) == 2:
        bookmarks = extract_bookmarks(sys.argv[1])
        print(format_to_html(bookmarks))
    else:
        print(f"Usage: extract_bookmarks.py <html_bookmarks_file>")
