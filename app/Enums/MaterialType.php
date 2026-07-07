<?php

namespace App\Enums;

enum MaterialType: string
{
    case Markdown = 'markdown';
    case Pdf = 'pdf';
    case Slides = 'slides';
    case Snippet = 'snippet';
    case Standard = 'standard';
}
