my $mapping = {
    start   => sub {
        my $ComponentName = @_[0] ? @_[0] : 'ComponentName';
        return "import React from 'react';\n\nconst ${ComponentName} = () => (";
    },
    end => sub {
        my $ComponentName = @_[0] ? @_[0] : 'ComponentName';
        return "\n);\n\nexport default ${ComponentName};";
    }
};

sub convertToClassName {
    my $line = shift;
    $line =~ s/ class ?= ?/ className=/;
    $line =~ s/ for ?= ?/ htmlFor=/;
    return $line;
}

sub convertLocalize {
    my $line = shift;
    $line =~ s/l\(/it.L(/g;
    $line =~ s/([a-z]+=)it\.L(.+)\)/$1\{it.L$2\)\}/g;
    return $line;
}

sub convertQuotes {
    my $line = shift;
    # Requirements:
    # Only Convert the beginning " to ';
    if ($line =~ m/(".+)\'(.+")/) {
        $line =~ s/'/\\'/g;
    }
    $line =~ s/\"/\'/g;
    return $line
}

sub converUrlFor {
    my $line = shift;
    $line =~ s/request(\.url_for)/it$1/g;
    return $line;
}

sub otherReplacements {
    my $line = shift;
    $line =~ s/(website_name|japan_docs_url)/it.$1/;
    return $line;
}
sub processCommands {
    my $line = shift;
    if($line =~ m/\[\% ([A-Z]+)/) {
        print $1;
    } else {
        $line =~ s/(\'|\")?\[\% /{/g;
        $line =~ s/ \%\](\'|\")?/}/g;
    }
    return $line;
}

my $fileName = @ARGV[0];
@ARGV[0] =~ s/.html.tt/.jsx/;
my $newFile = @ARGV[0];

open (my $fh, '<:encoding(UTF-8)', $fileName) or die "Error opening file ${fileName}";
open (my $fw, '>', $newFile) or die "Error creating new file $newFile";

print $fw $mapping->{start}->(@ARGV[1]);
while (my $line = <$fh>) {
    chomp $line;
    $line = processCommands($line);
    $line = convertToClassName($line);
    $line = convertLocalize($line);
    $line = convertQuotes($line);
    $line = converUrlFor($line);
    $line = otherReplacements($line);
    print $fw $line;
}

print $fw $mapping->{end}->(@ARGV[1]);
close $fh;
close $fw;